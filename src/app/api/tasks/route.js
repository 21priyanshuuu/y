import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import taskSchema from "@/models/taskSchema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const email = user?.email;
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort");

  let filter = { email };
  let sortOption = { Deadline: 1 };

  if (sort === "completed") filter.Status = true;
  else if (sort === "pending") filter.Status = false;

  const tasks = await taskSchema.find(filter).sort(sortOption);
  return NextResponse.json({ tasks });
}

export async function POST(req) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const email = user?.email;
  await dbConnect();

  const body = await req.json();
  const { Title, Deadline, Status, addInfo } = body;

  if (!Title || !Deadline || Status === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newTask = new taskSchema({
    Title,
    Deadline,
    Status,
    addInfo,
    email,
  });

  await newTask.save();
  return NextResponse.json({ message: "Task created!" }, { status: 201 });
}

export async function PUT(req) {
  const body = await req.json();
  const { _id, Title, Deadline, Status, addInfo } = body;

  if (!_id || !Title || !Deadline || Status === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();
  await taskSchema.findByIdAndUpdate(_id, { Title, Deadline, Status, addInfo });
  return NextResponse.json({ message: "Task updated!" });
}

export async function DELETE(req) {
  const body = await req.json();
  const { _id } = body;

  if (!_id) {
    return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
  }

  await dbConnect();
  await taskSchema.findByIdAndDelete(_id);
  return NextResponse.json({ message: "Task deleted!" });
}
