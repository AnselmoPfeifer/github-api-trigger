import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Owner and repo parameters are required' }, { status: 400 });
  }

  try {
    const response = await octokit.repos.getCommit({
      owner,
      repo,
      ref: 'HEAD',
    });

    const { sha, commit, author } = response.data;

    const latestCommit = {
      hash: sha,
      message: commit.message,
      author: commit.author.name,
      date: commit.author.date,
      avatarUrl: author?.avatar_url,
    };

    return NextResponse.json(latestCommit);
  } catch (error) {
    console.error('Error fetching commit:', error);
    return NextResponse.json({ error: 'Failed to fetch commit information' }, { status: 500 });
  }
}