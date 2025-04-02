import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/lib/constants";
import { redirect, RedirectType } from "next/navigation";

export default async function Home({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {

  const {code, access} = await searchParams;

  if(code){
    const headers = {
      "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };
  
    const {access_token} = await fetch("https://auth.calendly.com/oauth/token", {method: "POST",headers: headers, body: new URLSearchParams({
      "grant_type": "authorization_code",
      "code": code as string,
      "redirect_uri": REDIRECT_URI as string
    })}).then(res => res.json());
    if(access_token){
      console.log(access_token);
      redirect(`/?access=${access_token}`, RedirectType.replace);
    }
  }

  return (
    <>
      <a href={`https://auth.calendly.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`}>Get Authorization</a>
    </>
  );
}
