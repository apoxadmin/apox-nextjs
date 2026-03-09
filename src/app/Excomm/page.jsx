import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ["normal", "italic"] });

const positions = [
  {
    title: "President: Kiana Ablaza",
    image: "/kiana.JPEG",
    blurb:
      "I had the privilege of knowing about APO before coming to UCLA through my parents and uncles. I saw the connections and experiences they had and hoped to find that for myself. I've been in APO since my first quarter, and even after getting involved with new commitments and getting closer to graduation, what ultimately keeps me coming back are the friends I've made and the impacts our work has on the community. Joining APO has been the most fulfilling and wonderful decision I've made as not only an undergraduate, but a person, and I hope others can experience that same support and community. ",
  },
  {
    title: "Admin Vice President: Kyla Daez",
    image: "/kyla.JPEG",
    blurb: "When I entered college, I thought I would focus more on career oriented goals, but I felt that community service would be fulfilling for myself. I became close to my line, p-bros, and fam that are now long-lasting friendships. APO allows me to network with different majors to learn more about the person and not stay in the engineering field. I did not expect the benefits that this fraternity gave me. #LFS",
  },
  {
    title: "Admin Vice President: Sean Lee Phu",
    image: "/sean.JPEG",
    blurb:
      "I joined Alpha Phi Omega because I wanted to be part of something bigger than myself—a community built on leadership, friendship, and service. Giving back has always been important to me, and APO gave me a space where I could grow while helping others. It’s more than just a service organization; it feels like home.",
  },
    {
    title: "Membership Vice President: Grace Jacildone ",
    image: "/grace.JPEG",
    blurb:
      "I joined Alpha Phi Omega because I wanted to make more friends, find a community, and get involved with service opportunities on campus and in the LA area. Through APO, I've been able to connect with amazing people while giving back in meaningful ways. I'm so glad I joined because it's given me both lasting friendships and a true sense of belonging.",
  },
    {
    title: "Membership Vice President: Malakai Solemnidad",
    image: "/malakai.JPEG",
    blurb:
      "As corny as it sounds, I joined APO because of the people! The community and atmosphere this frat brings is truly welcoming!",
  },
    {
    title: "Service Vice President: Nathan Min",
    image: "/nathan.JPEG",
    blurb:
      "Our Organization has consolidated the culture of single-hearted unity, and is overflowing with warm sincere people. Where else in the world would our hearts lie?",
  },
    {
    title: "Service Vice President: Devon Vo",
    image: "/devon.JPEG",
    blurb:
      "I joined APO because I wanted a close knit-community that shared my ideals, accepted me for who I am, did good for the community, and be with me in my numerous up and down moments in college that make it memorable. Being a part of Naval ROTC (5 year min active duty service after graduation) is where my dedication for service really shows/tested but APO serves as a place for me to decompress and really be myself, continue being of service, lead how I want to lead, step out of my comfort zone, meet new people, and explore and grow as a person. Being out-of-state was initially really tough for me because many people had prior high-school connections or could relate to other CA people and so it was hard for me to relate or fit in friend groups/make close friends. APO gave me a chance to show others that I was more than just an East Coast person who was solely focused on grades, fitness, history/poli-sci, and the military. My favorite memory was going to my first rave (Beyond 2025) with APO people. It was something I never imagined I would EVER do and I don’t really listen nor like EDM music that much but, I had so much fun with APO that I would absolutely 100% do it again :). If you’re someone who's looking to do good in the community, wants long-lasting deep relations, and countless memorable moments then APO is the perfect place for you!",
  },
    {
    title: "Finance Vice President: Hailey Brown",
    image: "/hailey.JPEG",
    blurb:
      "Joining Alpha Phi Omega felt like a natural step for me because I’ve always believed in the power of service to build character and community. APO gave me a chance to turn my passion for volunteering into meaningful action while surrounding myself with people who care deeply. It’s helped me grow personally and professionally in ways I didn’t expect.",
  },
    {
    title: "Finance Vice President: Morgan Nguyen",
    image: "/morgan.JPEG",
    blurb:
      "I initially joined APO because I wanted to be involved in community service activities. I stayed in APO because of the people I met who have become my close friends! Whether it's late-night study hours or random eats across the county, APO has really made my time as a transfer a college experience.",
  },
    {
    title: "Fellowship Vice President: Christiana Reantaso",
    image: "/christiana.JPEG",
    blurb:
      "Pledging was one of the most spontaneous yet fulfilling things I’ve done in college. I came to APO hoping to find a community of like-minded people who cared about giving back to the community and to each other, and I did! Joined for the vibes, stayed for the memories and friendships. #livelaughloveLFS",
  },
    {
    title: "Fellowship Vice President: Jonathan Wang",
    image: "/jonathan.JPEG",
    blurb:
      "I joined APO to connect with new people and find meaningful ways to serve my community. Since then, the experience has constantly pushed me out of my comfort zone, forcing me to grow in ways I hadn't anticipated. I love being part of this group because it challenges my perspectives while allowing me to make a tangible impact.",
  },
    {
    title: "Pledge Parent: Mia Madarang",
    image: "/mia.JPEG",
    blurb:
      "I joined APO because I was looking for a sense of community. As a first year, every organization seemed daunting but APO welcomed me with open arms. Personally, APO is a place that cultivates a sense of belonging while enforcing the principles of being a leader, friend, and an individual who serves. Here at APO, you'll find a place where you belong while developing your character and allowing you to find your sense of individuality.",
  },
    {
    title: "Pledge Parent: Samantha Soohoo",
    image: "/samantha.JPEG",
    blurb:
      "I joined APO wanting to get involved with a diverse community of people with similar interests. When my second year at UCLA came around, I was ready to try something new, and that’s how I was led to APO. My friends introduced me to this fraternity, telling me that I should check it out, and the rest is history. If it wasn’t for APO, I wouldn’t have met my lifelong friends or found a sense of community and belonging at UCLA. If you are even the slightest bit interested in any part of what we do, I highly encourage you to check us out!",
  },
    {
    title: "Historian: Will Namvong",
    image: "/will.JPG",
    blurb:
      "I joined Alpha Phi Omega because I wanted to make more friends, find a community, and get involved with service opportunities on campus and in the LA area. Through APO, I've been able to connect with amazing people while giving back in meaningful ways. I'm so glad I joined because it's given me both lasting friendships and a true sense of belonging. ",
  },
    {
    title: "Historian: Amanda Tam",
    image: "/amanda.JPEG",
    blurb:
      "I joined APO hoping to find a group of people equally passionate about giving back to the community. Along the way, I discovered a community of my own and made lifelong memories that continue to bring me back!",
  },
      {
    title: "Sergeant-at-Arms: Kathy Pham",
    image: "/kathy.JPEG",
    blurb:
      "I have always enjoyed giving back to my community, so getting to meet awesome people along the way has been worthwhile.",
  },
      {
    title: "Interchapter Chair: Miguel James",
    image: "/mj.JPEG",
    blurb:
      "Oftentimes, the best decisions are made in faith - not because we can clearly see what something will amount to, but because we trust it will become something worthwhile in time. Joining Alpha Phi Omega was one of those decisions for me, and in hindsight, it’s one I would make again and again without hesitation. I’ve been given more than I ever could have anticipated: lasting memories, meaningful opportunities to serve, and a timely collection of friendships. Even if the man above placed his pen in my hands, I don’t think I could have written this experience any better than he already has.",
  },
      {
    title: "Interchapter Chair: Leah Oasay",
    image: "/leah.JPEG",
    blurb:
      "I joined APO after hearing from my friends about how impactful and welcoming the organization was, and I wanted to be part of something that gave back to the community. Since joining, I’ve made so many meaningful memories with my pledge bros and actives that have truly made my time at UCLA some of the best moments of my college experience.",
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