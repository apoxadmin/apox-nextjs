import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ["normal", "italic"] });

const positions = [
  {
    title: "President: Yahir Perez",
    image: "/YahirP.jpg",
    blurb:
      "I joined Alpha Phi Omega to find a community on campus that focused on Leadership, Friendship, and Service! Over the years I have gained so much perspective on what service can look like and mean to others. APO has also brought me my closest friends that I know I will cherish forever. ",
  },
  {
    title: "Admin Vice President: Kristen Takamure",
    image: "/KristenT.jpg",
    blurb: "I joined APO because I wanted to find a community where I could meet people with different interests while still sharing common values. Coming from Hawaiʻi, I also wanted to create a sense of home here at UCLA and build friendships with people I could make lasting memories with. I hoped to step outside my usual routine, get more involved, and give back to the community along the way.",
  },
  {
    title: "Admin Vice President: Sebastianne Jen Jorge",
    image: "/seb.webp",
    blurb:
      "I joined APO because I wanted to be part of a community where I could give back to others while meeting people who make college feel a little more like home. I was excited to make meaningful friendships, try new things, and have people to share the little moments with (and maybe show off my trinket collection to).",
  },
    {
    title: "Membership Vice President: Christiana Reantaso ",
    image: "/ChristianaR.jpg",
    blurb:
      "Pledging was one of the most spontaneous yet fulfilling things I’ve done in college. I came to APO hoping to find a community of like-minded people who cared about giving back to the community and to each other, and I did! Joined for the vibes, stayed for the memories and friendships. #livelaughloveLFS",
  },
    {
    title: "Membership Vice President: William Namvong",
    image: "/WilliamN.jpg",
    blurb:
      "I joined Alpha Phi Omega because I wanted to make more friends, find a community, and get involved with service opportunities on campus and in the LA area. Through APO, I've been able to connect with amazing people while giving back in meaningful ways. I'm so glad I joined because it's given me both lasting friendships and a true sense of belonging.",
  },
    {
    title: "Service Vice President: Emma Sahagun",
    image: "/emma.jpg",
    blurb:
      "I joined APO because I wanted to meet new people, make genuine friendships, and find a community to share fun experiences with. I also wanted to make the most of college by trying new things, whether that meant service events, spontaneous adventures, or finding new people to play Roblox with.",
  },
    {
    title: "Service Vice President: Joliet Nguyen",
    image: "/Joliet.webp",
    blurb:
      "I joined APO because I wanted to find people who share my love for trying new things, making memories, and having fun together. I also wanted to meet friends outside my usual circles and have a little community to make college feel less overwhelming. Plus, who doesn't want more people to go on food adventures with?",
  },
    {
    title: "Finance Vice President: Dario Bermea",
    image: "/Dario.png",
    blurb:
      "I joined APO because I wanted to find a fun and welcoming community where I could meet new people and make genuine friendships. I also wanted to get involved in service while enjoying new experiences and making the most of college.",
  },
    {
    title: "Finance Vice President: Kyla Victorino",
    image: "/Kyla Vic.jpg",
    blurb:
      "I joined APO to step outside my comfort zone, meet people from different backgrounds, and get involved in meaningful service. I also wanted to create new experiences, explore different opportunities, and make the most of my time at UCLA.",
  },
    {
    title: "Fellowship Vice President: Laura Vo",
    image: "/laura.jpg",
    blurb:
      "I joined Alpha Phi Omega because I love volunteering and making friends throughout the process. I stayed for the community and the opportunity to work alongside my friends.",
  },
    {
    title: "Fellowship Vice President: Michelle Phan",
    image: "/MichelleP.jpg",
    blurb:
      "I joined APO because I wanted to meet people outside of my usual circles and experience new things with a community of like-minded individuals. I was drawn to the opportunity to participate in creative fellowship activities, explore different interests, and make the most of my college experience. I also wanted to be surrounded by people who encourage me to try new things, have fun, and create memories that I can look back on.",
  },
    {
    title: "Pledge Parent: Kiana Ablaza",
    image: "/KianaA.jpg",
    blurb:
      "I had the privilege of knowing about APO before coming to UCLA through my parents and uncles. I saw the connections and experiences they had and hoped to find that for myself. I've been in APO since my first quarter, and even after getting involved with new commitments and getting closer to graduation, what ultimately keeps me coming back are the friends I've made and the impacts our work has on the community. Joining APO has been the most fulfilling and wonderful decision I've made as not only an undergraduate, but a person, and I hope others can experience that same support and community.",
  },
    {
    title: "Pledge Parent: Kaya Lee-Goins",
    image: "/KayaLee.jpg",
    blurb:
      "I joined APO because I wanted to be part of an organization where I could grow as a leader while making a meaningful impact through service. I was excited by the opportunity to connect with people from different backgrounds, try new experiences, and build friendships that would last beyond college. I also wanted to find a community that would challenge me to step outside my comfort zone while creating fun and memorable experiences along the way.",
  },
    {
    title: "Historian: Subha Tubassum",
    image: "/subha.jpg",
    blurb:
      "I joined APO to meet new people, get involved, and find people who are just as passionate about giving back! Safe to say I got way more than I signed up for and found some of my favorite people and made the best memories along the way. ",
  },
    {
    title: "Historian: Kelsey Salazar",
    image: "/KelseyS.jpg",
    blurb:
      "I joined APO because I wanted to surround myself with people who care about making a difference in their community. As a first-generation student, I also wanted to find a space where I could connect with others, learn from their experiences, and feel supported throughout my college journey. I was excited to get involved in service opportunities that align with my values while building connections that extend beyond UCLA.",
  },
      {
    title: "Sergeant-at-Arms: Fern Mao",
    image: "/FernM.jpg",
    blurb:
      "I joined APO to find a close-knit community at UCLA where I could meet new people, build meaningful friendships, and give back through service. I wanted to get more involved on campus, develop my leadership skills, and connect with people who share similar values and interests. I also hoped to find a sense of belonging and make lasting memories with people outside of my academic and professional life.",
  },
      {
    title: "Interchapter Chair: Elizabeth Yawata",
    image: "/ellie.jpg",
    blurb:
      "I joined APO because I heard about the organization from my brother who joined at another chapter. It was also a way to meet new people.",
  },
      {
    title: "Interchapter Chair: Mark Flores",
    image: "/Mark.png",
    blurb:
      "Joining APO was something that I did not plan to do coming into my first year here at UCLA, but I'm glad I did. Through APO, I've met some of my closest friends who I can spend forever with no matter what we do. It's a space that helps students build friendships and also the gateway of giving back to the community. The memories I've made here is something I will truly cherish.",
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