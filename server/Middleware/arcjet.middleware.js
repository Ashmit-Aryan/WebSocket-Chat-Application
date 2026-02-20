import { aj } from "../lib/arcjet.js";


export const arcjetProtection = async (req, res, next) => {
    try {
const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.isSpoofedBot) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
        
    } catch (error) {
        console.error("Error in Arcjet protection middleware:", error);
        res.status(500).json({ message: "Server error" });
    }
}