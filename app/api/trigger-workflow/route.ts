import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Initialize Octokit with your GitHub token
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function POST(request: Request) {
  try {
    const { owner, repo, workflow_id, branch } = await request.json();

    // Validate input
    if (!owner || !repo || !workflow_id || !branch) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Trigger the workflow
    const response = await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id,
      ref: branch,
      inputs: {
        branch: branch
      }
    });

    if (response.status === 204) {
      return NextResponse.json(
        { message: 'Workflow triggered successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to trigger workflow' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return NextResponse.json(
      { error: 'An error occurred while triggering the workflow' },
      { status: 500 }
    );
  }
}