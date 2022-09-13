import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();
  response.cookies.set("codedamn", "is-awesome");

  return response;
}
