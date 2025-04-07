import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not defined");
    return new NextResponse("Webhook secret not provided", { status: 500 });
  }

  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Error: Missing Svix headers");
      return new NextResponse("Error: Missing Svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("Webhook verified successfully");
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new NextResponse("Error verifying webhook", { status: 400 });
    }

    // Handle the webhook
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook with ID: ${id} and type: ${eventType}`);

    // Process user creation
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      await connectToDatabase();
      console.log("Connected to MongoDB for user creation");

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        username: username || `user_${id.slice(0, 8)}`,
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
      };

      const newUser = await User.findOneAndUpdate({ clerkId: id }, user, {
        upsert: true,
        new: true,
      });

      console.log(`User created in MongoDB: ${id}`);
      return NextResponse.json({ success: true, user: newUser });
    }

    // Process user update
    if (eventType === "user.updated") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      await connectToDatabase();
      console.log("Connected to MongoDB for user update");

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses?.[0]?.email_address,
          username: username,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        },
        { new: true }
      );

      console.log(`User updated in MongoDB: ${id}`);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Process user deletion
    if (eventType === "user.deleted") {
      await connectToDatabase();
      console.log("Connected to MongoDB for user deletion");

      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      console.log(`User deleted from MongoDB: ${id}`);

      return NextResponse.json({ success: true, user: deletedUser });
    }

    // Default response for unhandled events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
