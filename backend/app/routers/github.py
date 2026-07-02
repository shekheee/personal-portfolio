import httpx
import logging
from fastapi import APIRouter, Depends, HTTPException
from app.config import get_settings, Settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/github", tags=["github"])

GITHUB_API = "https://api.github.com"


def _headers(token: str) -> dict:
    h = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    if token:
        h["Authorization"] = f"Bearer {token}"
    return h


@router.get("/stats")
async def github_stats(settings: Settings = Depends(get_settings)):
    username = settings.github_username
    headers = _headers(settings.github_token)

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            user_resp = await client.get(f"{GITHUB_API}/users/{username}", headers=headers)
            user_resp.raise_for_status()
            user = user_resp.json()

            repos_resp = await client.get(
                f"{GITHUB_API}/users/{username}/repos?per_page=100&sort=updated",
                headers=headers,
            )
            repos_resp.raise_for_status()
            repos = repos_resp.json()

            total_stars = sum(r.get("stargazers_count", 0) for r in repos)
            total_forks = sum(r.get("forks_count", 0) for r in repos)

            # Language breakdown
            lang_counts: dict[str, int] = {}
            for repo in repos:
                lang = repo.get("language")
                if lang:
                    lang_counts[lang] = lang_counts.get(lang, 0) + 1

            top_languages = sorted(lang_counts.items(), key=lambda x: -x[1])[:6]

            return {
                "username": username,
                "name": user.get("name", username),
                "avatar_url": user.get("avatar_url"),
                "bio": user.get("bio"),
                "public_repos": user.get("public_repos", 0),
                "followers": user.get("followers", 0),
                "following": user.get("following", 0),
                "total_stars": total_stars,
                "total_forks": total_forks,
                "top_languages": [{"language": l, "count": c} for l, c in top_languages],
            }
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="GitHub API error")
        except Exception as e:
            logger.error(f"GitHub stats error: {e}")
            raise HTTPException(status_code=502, detail="Failed to fetch GitHub data")


@router.get("/contributions")
async def github_contributions(settings: Settings = Depends(get_settings)):
    """Return fake contribution data shape for the heatmap frontend component.
    Real data can come from GitHub's GraphQL API with a token."""
    username = settings.github_username
    headers = _headers(settings.github_token)

    if not settings.github_token:
        # Return empty — heatmap will show placeholder
        return {"contributions": []}

    # GraphQL query for contribution calendar
    query = """
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
    """
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.post(
                "https://api.github.com/graphql",
                headers=headers,
                json={"query": query, "variables": {"username": username}},
            )
            resp.raise_for_status()
            data = resp.json()
            weeks = (
                data.get("data", {})
                .get("user", {})
                .get("contributionsCollection", {})
                .get("contributionCalendar", {})
                .get("weeks", [])
            )
            contributions = [
                {"date": day["date"], "count": day["contributionCount"]}
                for week in weeks
                for day in week["contributionDays"]
            ]
            return {"contributions": contributions}
        except Exception as e:
            logger.error(f"GitHub contributions error: {e}")
            return {"contributions": []}
