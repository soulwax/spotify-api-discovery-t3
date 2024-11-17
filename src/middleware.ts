// File: src/middleware.ts
import { authMiddleware } from "next-auth/middleware/auth";

export default authMiddleware({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    // Add your protected routes here
    "/dashboard/:path*",
    "/api/authenticated/:path*",
  ],
};