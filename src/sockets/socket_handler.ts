import { io } from "./index.ts";
import { prisma } from "../lib/db.ts";
import { create_chat_schema } from "../schemas/request_data.schema.ts";
import type { Response, Request } from "express";

class SocketClass {
  create_chat = async (req: Request, res: Response) => {
    try {
      const { user_id, biz_email } = req.body;

      // 1. Get the Business ID from email
      const biz = await prisma.businessOwnerAuth.findUnique({
        where: { emailAddress: biz_email },
      });

      if (!biz) {
        return res.status(404).send({ message: "Business not found" });
      }

      // 2. Find or Create the chat (Idempotent)
      const chat = await prisma.chatRoom.upsert({
        where: {
          userId_businessId: {
            userId: user_id,
            businessId: biz.id,
          },
        },
        update: {}, // Do nothing if it exists
        create: {
          userId: user_id,
          businessId: biz.id,
          name: `Chat with ${biz.id}`,
        },
      });

      res.status(200).send({
        message: "Chat retrieved or created",
        chat_id: chat.id,
      });
    } catch (error) {
      console.error("Error in create_chat:", error);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };
  get_chat_messages = async (req: Request, res: Response) => {
    const { chat_id } = req.params;

    try {
      const chat_history = await prisma.chatRoom.findUnique({
        where: {
          id: chat_id as string,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc", // Ensures chronological order
            },
            include: {
              image: true, // Includes image details if the message has an image
            },
          },
        },
      });

      if (!chat_history) {
        return res.status(404).send({ message: "Chat room not found" });
      }

      res.status(200).send({
        chat_id: chat_history.id,
        messages: chat_history.messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  };
  // Part 1: Delete all images in the room
  delete_chat_images = async (req: Request, res: Response) => {
    const { chat_id } = req.params;
    try {
      const deletedImages = await prisma.image.deleteMany({
        where: { message: { roomId: chat_id as string } },
      });
      res
        .status(200)
        .send({ message: "Images deleted", count: deletedImages.count });
    } catch (error) {
      res.status(500).send({ message: "Failed to delete images" });
    }
  };

  // Part 2: Delete all messages in the room
  delete_chat_messages = async (req: Request, res: Response) => {
    const { chat_id } = req.params;
    try {
      const deletedMessages = await prisma.message.deleteMany({
        where: { roomId: chat_id as string },
      });
      res
        .status(200)
        .send({ message: "Messages deleted", count: deletedMessages.count });
    } catch (error) {
      res.status(500).send({ message: "Failed to delete messages" });
    }
  };

  delete_chat_room = async (req: Request, res: Response) => {
    const { chat_id } = req.params;
    try {
      await prisma.chatRoom.delete({
        where: { id: chat_id as string },
      });
      res.status(200).send({ message: "Chat room deleted" });
    } catch (error) {
      res.status(500).send({ message: "Failed to delete room" });
    }
  };
}
// nyew code 
export const socketController = {
  io,
  onConnection: (callback: (socket: any) => void) => {
    io.on("connection", callback);
  },
};
export { SocketClass };
