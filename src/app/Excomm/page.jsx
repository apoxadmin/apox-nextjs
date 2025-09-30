import Navbar from "@/components/Navbar";
import { Caprasimo, Rubik } from "next/font/google";

const titleFont = Caprasimo({ subsets: ["latin"], weight: ["400"] });
const textFont = Rubik({ subsets: ["latin"], style: ["normal", "italic"] });

const positions = [
  {
    title: "President: Kiana Ablaza",
    image: "/BKpres.JPG",
    blurb:
      "I had the priviledge of knowing about APO before coming to UCLA through my parents and uncles. I saw the connections and experiences they had and hoped to find that for myself. I've been in APO since my first quarter, and even after getting involved with new commitments and getting closer to graduation, what ultimately keeps me coming back are the friends I've made and the impacts our work has on the community. Joining APO has been the most fulfilling and wonderful decision I've made as not only an undergraduate, but a person, and I hope others can experience that same support and community. ",
  },
  {
    title: "Admin Vice President: Kyla Daez",
    image: "/BKadminVP1.jpeg",
    blurb: "When I entered college, I thought I would focus more on career oriented goals, but I felt that community service would be fulfilling for myself. I became close to my line, p-bros, and fam that are now long-lasting friendships. APO allows me to network with different majors to learn more about the person and not stay in the engineering field. I did not expect the benefits that this fraternity gave me. #LFS",
  },
  {
    title: "Admin Vice President: Sean Lee Phu",
    image: "/BKavp.PNG",
    blurb:
      "I joined Alpha Phi Omega because I wanted to be part of something bigger than myself—a community built on leadership, friendship, and service. Giving back has always been important to me, and APO gave me a space where I could grow while helping others. It’s more than just a service organization; it feels like home.",
  },
    {
    title: "Membership Vice President: Kaya Lee-Goins ",
    image: "/BKmvp1.JPG",
    blurb:
      "I joined APO as a first-year hoping to meet new people and explore different clubs on campus. I stayed because of the memories I made and the lasting friendships I found in this community.",
  },
    {
    title: "Membership Vice President: Kathy Pham",
    image: "/BKmvp2.JPG",
    blurb:
      "I have always enjoyed giving back to my community, so getting to meet awesome people along the way has been worthwhile.",
  },
    {
    title: "Service Vice President: Stella Kuang",
    image: "/BKsvp1.JPG",
    blurb:
      "I joined APO as a first year because I wanted to continue my love of community service and make long-lasting friendships with service-minded individuals. The community made me feel welcomed and supported at UCLA, and I always had someone to lean to, whether that be my big, p-bros, or fam.",
  },
    {
    title: "Service Vice President: Emily Wong",
    image: "/BKsvp2.JPG",
    blurb:
      "I joined APO to meet new friends and stay involved in community service, as I've been a Girl Scout since elementary school. Through APO, I've gone on trips and spontaneous adventures with people that I likely wouldn't have met otherwise, so I appreciate how APO has helped me to grow and step out of my comfort zone.",
  },
    {
    title: "Finance Vice President: Hailey Brown",
    image: "/BKavp.PNG",
    blurb:
      "Joining Alpha Phi Omega felt like a natural step for me because I’ve always believed in the power of service to build character and community. APO gave me a chance to turn my passion for volunteering into meaningful action while surrounding myself with people who care deeply. It’s helped me grow personally and professionally in ways I didn’t expect.",
  },
    {
    title: "Finance Vice President: Morgan Nguyen",
    image: "/BKavp.PNG",
    blurb:
      "I initially joined APO because I wanted to be involved in community service activities. I stayed in APO because of the people I met who have become my close friends! Whether it's late-night study hours or random eats across the county, APO has really made my time as a transfer a college experience.",
  },
    {
    title: "Fellowship Vice President: Linda Nguyen",
    image: "/BKfvp1.JPG",
    blurb:
      "What drew me to Alpha Phi Omega was its strong foundation in service and the opportunity to connect with like-minded people. I was looking for a way to develop leadership skills while making a real difference, and APO offered that balance perfectly. It’s helped me find purpose and lifelong friendships.",
  },
    {
    title: "Fellowship Vice President: Vicky Xu",
    image: "/BKfvp2.PNG",
    blurb:
      "I joined APO because it allows me to leave a positive impact both on campus and across LA alongside my wonderful friends through diverse service opportunities!",
  },
    {
    title: "Pledge Parent: Chloe Liu",
    image: "/BKpp1.JPG",
    blurb:
      "I joined APO because I was looking for a community thay would welcome me and help me find my place at UCLA. It is one of the best decisions I've made and I am grateful for all the amazing people that made this campus feel like a second home. The meaningful relationships I've formed through APO are what keep me coming back every term for more shenanigans!",
  },
    {
    title: "Pledge Parent: Yahir Perez",
    image: "/BKpp2.JPG",
    blurb:
      "APO to me is about the deep bonds and personal development that comes with being involved. From pledge to now Pledge parent, I have been able to widen my horizon and viewpoint through the various types of people I have met throughout my time in APO. I love APO because it gives everyone a chance to get to know each other and has given me experiences I don't think I would have otherwise!",
  },
    {
    title: "Historian: Grace Jacildone",
    image: "/BKhistorian1.jpeg",
    blurb:
      "I joined Alpha Phi Omega because I wanted to make more friends, find a community, and get involved with service opportunities on campus and in the LA area. Through APO, I've been able to connect with amazing people while giving back in meaningful ways. I'm so glad I joined because it's given me both lasting friendships and a true sense of belonging. ",
  },
    {
    title: "Historian: Malakai Solemnidad",
    image: "/BKhistorian2.JPG",
    blurb:
      "As corny as it sounds, I joined APO because of the people! The community and atmosphere this frat brings is truly welcoming!",
  },
      {
    title: "Sergeant-at-Arms: Nathan Min",
    image: "/BKsaa.jpeg",
    blurb:
      "I endeavored to join this organization because it cultivated a culture oriented around the masses of people rallying around the ideas of friendship, leadership, and service with single-hearted unity. It is my belief that the great memories made here will shine on forever. Who in the whole wide world has a brotherhood as strong as ours?",
  },
      {
    title: "Interchapter Chair: Mia Madarang",
    image: "/BKic1.jpeg",
    blurb:
      "I joined APO because I was looking for a sense of community. As a first year, every organization seemed daunting but APO welcomed me with open arms. Personally, APO is a place that cultivates a sense of belonging while enforcing the principles of being a leader, friend, and an individual who serves. Here at APO, you'll find a place where you belong while developing your character and allowing you to find your sense of individuality.",
  },
      {
    title: "Interchapter Chair: Allie Quan",
    image: "/BKic2.jpeg",
    blurb:
      "I joined APO because a few of my friends were already in this organization and recommended it to me. I quickly saw how welcoming and fun this community is! I love meeting new people and taking on new opportunities. I've met some of my closest friends and gained valuable experience through APO!",
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