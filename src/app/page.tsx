import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/lib/constants";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import CalendlyButton from "./ui/calendlyBtn";

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

  const { code, access, ownerUri, uri } = await searchParams;

  if (code) {
    const headers = {
      "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const { access_token, owner } = await fetch("https://auth.calendly.com/oauth/token", {
      method: "POST", headers: headers, body: new URLSearchParams({
        "grant_type": "authorization_code",
        "code": code as string,
        "redirect_uri": REDIRECT_URI as string
      })
    }).then(res => res.json());
    if (access_token) {
      redirect(`/?access=${access_token}&ownerUri=${owner}`, RedirectType.replace);
    }
  }

  const { collection } = await fetch(`https://api.calendly.com/event_types?user=${ownerUri}`, { method: "GET", headers: { "Authorization": `Bearer ${access}` } }).then(res => res.json());

  return (
    <>
    
      <div id="container"></div>
      {uri && <>
        <CalendlyButton href={uri as string} />
      </> || access && !uri &&
        <>

          <ul className="flex gap-4">
            {
              collection.map((event: any) => {
                return (
                  <li key={event.uri}>
                    <Link className="block rounded-[8px] border p-4" href={`/?uri=${event.scheduling_url}`}>
                      <h2 className="font-bold">{event.name}</h2>
                      <p>duration: {event.duration} mins</p>
                    </Link>
                  </li>);
              })
            }
          </ul>

        </> || <a className="p-4 border" href={`https://auth.calendly.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`}>Get Authorization</a>}
    </>
  );
}
