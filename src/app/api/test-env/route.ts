// Simple test API route
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    database_url: process.env.DATABASE_URL ? 'Set' : 'Not set',
    node_env: process.env.NODE_ENV,
    env_keys: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('JWT'))
  });
}