"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SubscribeDialog() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function subscribeUser(email: string): Promise<string> {
    const apiUrl = "/api/subscribe"; // Adjust the API endpoint if needed

    try {
      // Make a POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Parse the response
      if (response.status === 201) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = await response.json();
        return "Subscription successful!";
      } else if (response.status === 400) {
        const error = await response.json();
        if (error.error === "User already subscribed") {
          return "User already subscribed.";
        }
        return "Invalid email address. Please try again.";
      } else {
        return "An error occurred. Please try again later.";
      }
    } catch (error) {
      console.error("Error during subscription:", error);
      return "Unable to connect to the server. Please try again later.";
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitForm = async (event: any) => {
    event.preventDefault();

    setMessage(await subscribeUser(email));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Subscribe to Updates</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Updates</DialogTitle>
          <DialogDescription>
            Subscribe to get updates from our statuspage about events with our
            services
          </DialogDescription>
          {message}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3">
            <Input
              id="name"
              placeholder="owen@nixlabs.dev"
              className="col-span-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={submitForm}>
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
