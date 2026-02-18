import { aj } from "../lib/arcjet";


export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (decision.reason.isRateLimit) {
            return res.status(429).json({ message: "Rate limit exceeded" });
        }
        if (decision.reason.isBot) {
            return res.status(403).json({ message: "Bot traffic blocked" });
        } else{
            return res.status(403).json({ message: "Request blocked by Arcjet" });
        }
        if(decision.reason.isSpoofedBot){
            return res.status(403).json({ message: "Spoofed bot traffic blocked" });
        }
        next();
    } catch (error) {
        console.error("Error in Arcjet protection middleware:", error);
        res.status(500).json({ message: "Server error" });
    }
}