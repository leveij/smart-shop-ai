import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";

const SYSTEM = `You are ShopAI, an action-taking shopping assistant for an Indian e-commerce store. You can add products to the user's cart, save their delivery address, and send them to checkout to pay.

You MUST respond with ONLY a valid JSON object (no markdown fences, no extra text) of the shape:
{
  "reply": "short friendly message shown to the user (1-3 sentences)",
  "actions": [ ...zero or more action objects... ]
}

Allowed actions:
- { "type": "add_to_cart", "productId": "<id from catalog>", "qty": <integer, default 1> }
- { "type": "remove_from_cart", "productId": "<id>" }
- { "type": "clear_cart" }
- { "type": "save_address", "address": { "name": "...", "email": "...", "phone": "...", "address": "...", "city": "...", "pincode": "..." } }
- { "type": "go_to_checkout" }
- { "type": "go_to_cart" }

Rules:
1. When the user asks for a product ("get me the best laptop", "add running shoes"), pick the single best match from the catalog by rating/price/fit and emit add_to_cart with the exact productId. Briefly say what you picked and why.
2. After adding, if the user said "checkout", "buy", "pay", or "complete order", check the saved address. If ANY of name/email/phone/address/city/pincode is missing, DO NOT go to checkout — ask the user for the missing fields in one short message. When the user gives details, emit save_address with whatever fields you parsed (omit unknown fields). Once all six fields are present, emit go_to_checkout.
3. Never invent product IDs. Only use IDs from the catalog below.
4. Never make up prices or stock. Quantities default to 1 unless the user specifies.
5. Keep the reply short. Do not list every product unless asked.
6. If the user just chats or asks a question, return an empty actions array.

Catalog (id | name | brand | category | price ₹ | rating):
${products.map((p) => `${p.id} | ${p.name} | ${p.brand} | ${p.category} | ${p.price} | ${p.rating}`).join("\n")}`;

type Msg = { role: "user" | "assistant" | "system"; content: string };
type Body = { messages?: Msg[]; context?: { cart: { id: string; qty: number }[]; address: Record<string, string | undefined> } };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages, context } = (await request.json()) as Body;
          if (!Array.isArray(messages)) return new Response("Bad request", { status: 400 });
          const key = process.env.LOVABLE_API_KEY;
          
          if (!key) {
            const lastMsg = messages.slice().reverse().find(m => m.role === "user")?.content.toLowerCase() || "";
            let reply = "I'm a demo assistant! Since no API key is provided, I only understand simple keywords like 'laptop', 'shoes', 'headphones', and 'checkout'.";
            const actions: unknown[] = [];
            
            if (lastMsg.includes("laptop")) {
              actions.push({ type: "add_to_cart", productId: "p2", qty: 1 });
              reply = "I've added our best-selling Nimbus X Gaming Laptop to your cart.";
            } else if (lastMsg.includes("shoe") || lastMsg.includes("running")) {
              actions.push({ type: "add_to_cart", productId: "p3", qty: 1 });
              reply = "I've added the Velocity Runner Sneakers for you!";
            } else if (lastMsg.includes("headphone") || lastMsg.includes("audio")) {
              actions.push({ type: "add_to_cart", productId: "p1", qty: 1 });
              reply = "Added the Aurora Pro Wireless Headphones to your cart.";
            } else if (lastMsg.includes("clear") || lastMsg.includes("empty")) {
              actions.push({ type: "clear_cart" });
              reply = "I've cleared your cart.";
            } else if (lastMsg.includes("checkout") || lastMsg.includes("pay") || lastMsg.includes("buy")) {
              const missing = ["name", "email", "phone", "address", "city", "pincode"].filter(k => !context?.address?.[k]);
              if (missing.length > 0) {
                reply = `To checkout, I need some delivery details. Could you provide your ${missing.join(", ")}?`;
              } else {
                actions.push({ type: "go_to_checkout" });
                reply = "Great! Let's complete your order.";
              }
            } else if (Object.keys(context?.address || {}).length < 6 && (lastMsg.includes("@") || /\d{10}/.test(lastMsg) || lastMsg.length > 10)) {
               actions.push({ type: "save_address", address: { name: "Test User", email: "test@example.com", phone: "1234567890", address: "123 Demo St", city: "Demo City", pincode: "123456" } });
               reply = "I've saved those details. Say 'checkout' when you are ready!";
            } else if (lastMsg.includes("hi") || lastMsg.includes("hello")) {
               reply = "Hello! Try asking me for a laptop, shoes, or headphones!";
            }

            return Response.json({ reply, actions });
          }

          const cartLines = (context?.cart ?? [])
            .map((c) => {
              const p = products.find((x) => x.id === c.id);
              return p ? `- ${p.id} ${p.name} x${c.qty}` : null;
            })
            .filter(Boolean)
            .join("\n") || "(empty)";
          const addr = context?.address ?? {};
          const missing = ["name", "email", "phone", "address", "city", "pincode"].filter((k) => !addr[k]);
          const stateMsg: Msg = {
            role: "system",
            content: `Current user state:\nCart:\n${cartLines}\nSaved address fields: ${JSON.stringify(addr)}\nMissing address fields: ${missing.length ? missing.join(", ") : "none"}`,
          };

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              response_format: { type: "json_object" },
              messages: [{ role: "system", content: SYSTEM }, stateMsg, ...messages],
            }),
          });
          if (!res.ok) {
            const text = await res.text();
            const status = res.status === 429 || res.status === 402 ? res.status : 500;
            return Response.json({ error: `AI gateway ${res.status}: ${text}` }, { status });
          }
          const data = (await res.json()) as { choices: { message: { content: string } }[] };
          const raw = data.choices?.[0]?.message?.content ?? "{}";
          let parsed: { reply?: string; actions?: unknown[] } = {};
          try {
            parsed = JSON.parse(raw);
          } catch {
            const m = raw.match(/\{[\s\S]*\}/);
            if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
          }
          return Response.json({
            reply: typeof parsed.reply === "string" ? parsed.reply : "Done.",
            actions: Array.isArray(parsed.actions) ? parsed.actions : [],
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});
