import { NextResponse } from 'next/server'

let tasks: string[] = ['Learn Next.js', 'Build an API', 'Create a web app']

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const { task } = await request.json()
  
  if (!task) {
    return NextResponse.json({ error: 'Task is required' }, { status: 400 })
  }

  tasks.push(task)
  return NextResponse.json({ message: 'Task added successfully', tasks }, { status: 201 })
}
