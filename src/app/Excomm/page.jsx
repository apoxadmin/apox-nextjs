import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ["normal", "italic"] });

const positions = [
  {
    title: "President: Yahir Perez",
    image: "/Yahir Perez.jpg",
    blurb:
      "President! ",
  },
  {
    title: "Admin Vice President: Kristen Takamure",
    image: "/kyla.JPEG",
    blurb: "...",
  },
  {
    title: "Admin Vice President: Sebastianne Jen Jorge",
    image: "/seb.webp",
    blurb:
      "...",
  },
    {
    title: "Membership Vice President: Christiana Reantaso ",
    image: "/christiana.jpg",
    blurb:
      "Pledging was one of the most spontaneous yet fulfilling things I’ve done in college. I came to APO hoping to find a community of like-minded people who cared about giving back to the community and to each other, and I did! Joined for the vibes, stayed for the memories and friendships. #livelaughloveLFS",
  },
    {
    title: "Membership Vice President: William Namvong",
    image: "/malakai.JPEG",
    blurb:
      "I joined Alpha Phi Omega because I wanted to make more friends, find a community, and get involved with service opportunities on campus and in the LA area. Through APO, I've been able to connect with amazing people while giving back in meaningful ways. I'm so glad I joined because it's given me both lasting friendships and a true sense of belonging.",
  },
    {
    title: "Service Vice President: Emma Sahagun",
    image: "/emma.jpg",
    blurb:
      "...",
  },
    {
    title: "Service Vice President: Joliet Nguyen",
    image: "/Joliet.webp",
    blurb:
      "...",
  },
    {
    title: "Finance Vice President: Dario Bermea",
    image: "/Dario.png",
    blurb:
      "...",
  },
    {
    title: "Finance Vice President: Kyla Victorino",
    image: "/Kyla Vic.jpg",
    blurb:
      "...",
  },
    {
    title: "Fellowship Vice President: Laura Vo",
    image: "/laura.jpg",
    blurb:
      "...",
  },
    {
    title: "Fellowship Vice President: Michelle Phan",
    image: "/jonathan.JPEG",
    blurb:
      "...",
  },
    {
    title: "Pledge Parent: Kiana Ablaza",
    image: "/mia.JPEG",
    blurb:
      "I had the privilege of knowing about APO before coming to UCLA through my parents and uncles. I saw the connections and experiences they had and hoped to find that for myself. I've been in APO since my first quarter, and even after getting involved with new commitments and getting closer to graduation, what ultimately keeps me coming back are the friends I've made and the impacts our work has on the community. Joining APO has been the most fulfilling and wonderful decision I've made as not only an undergraduate, but a person, and I hope others can experience that same support and community.",
  },
    {
    title: "Pledge Parent: Kaya Lee-Goins",
    image: "/KayaLee.jpg",
    blurb:
      "...",
  },
    {
    title: "Historian: Subha Tubassum",
    image: "/subha.jpg",
    blurb:
      "... ",
  },
    {
    title: "Historian: Kelsey Salazar",
    image: "/amanda.JPEG",
    blurb:
      "...",
  },
      {
    title: "Sergeant-at-Arms: Fern Mao",
    image: "/kathy.JPEG",
    blurb:
      "...",
  },
      {
    title: "Interchapter Chair: Elizabeth Yawata",
    image: "/ellie.jpg",
    blurb:
      "...",
  },
      {
    title: "Interchapter Chair: Mark Flores",
    image: "/Mark.png",
    blurb:
      "...",
  },
];

export default function Excomm() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden shadow-lg">
        <img
          src="/seniorpics.jpg"
          alt="Senior Photo"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 flex flex-col justify-center items-center text-white px-4 sm:px-8 md:px-16 text-center">
          <p
            className={`drop-shadow-md max-w-3xl ${textFont.className} text-lg sm:text-2xl md:text-4xl font-semibold`}
          >
            Be a leader. Be a friend. Be of service.
          </p>
        </div>
      </section>

      {/* Main Content with white background */}
      <div className="bg-white text-black">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Excomm Title */}
          <h1
            className={`${titleFont.className} text-5xl font-bold text-center mb-12`}
          >
            Executive Committee
          </h1>

          {/* Positions */}
          <section className="space-y-12">
            {positions.map(({ title, image, blurb }) => (
              <div
                key={title}
                className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10"
              >
                <img
                  src={image}
                  alt={`${title} photo`}
                  className="w-64 h-80 object-cover rounded-lg shadow-md flex-shrink-0"
                  loading="lazy"
                />
                <div>
                  <h2
                    className={`${titleFont.className} text-3xl font-semibold mb-3`}
                  >
                    {title}
                  </h2>
                  <p
                    className={`text-gray-700 text-lg max-w-xl ${textFont.className}`}
                  >
                    {blurb}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}