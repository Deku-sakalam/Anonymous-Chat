"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="homeWrapper">
      <div className="introBox">
        <h1 className="title">Welcome to Anonymous Chat</h1>

        <p className="subtitle">
          Speak freely, share your thoughts, and connect with others —
          <br />
          all without revealing your identity.
        </p>
        <button className="startButton" onClick={() => router.push("/bankers")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
