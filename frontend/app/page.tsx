import HomeClient from "./HomeClient";
import { getAllPosts } from "@/lib/blog";

export default function Home() {
  const posts = getAllPosts();
  return <HomeClient posts={posts} />;
}
