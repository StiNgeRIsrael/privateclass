import React, { useEffect, useRef } from 'react';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface InstructorProps {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  socialLinks: SocialLink[];
  index: number;
}

const Instructor: React.FC<InstructorProps> = ({
  name,
  role,
  imageUrl,
  description,
  socialLinks,
  index
}) => {
  const instructorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }, index * 150);
        }
      },
      { threshold: 0.1 }
    );

    if (instructorRef.current) {
      observer.observe(instructorRef.current);
    }

    return () => {
      if (instructorRef.current) {
        observer.unobserve(instructorRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={instructorRef}
      className="bg-[#2a2a2a] rounded-lg shadow-lg overflow-hidden transition-all duration-700 opacity-0 translate-y-10 transform hover:shadow-xl"
    >
      <div className="h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-all duration-500 transform hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className="text-green-700 font-medium mb-4">{role}</p>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex space-x-3 justify-start">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-700 transition-colors duration-300"
            >
              {link.icon}
            </a>
          ))}
        </div>
        <a 
          href="#pricing"
          className="mt-6 inline-block px-6 py-2 bg-green-700 text-white font-bold rounded hover:bg-green-800 transition-colors duration-300"
        >
          הזמן שיעור
        </a>
      </div>
    </div>
  );
};

const Instructors: React.FC = () => {
  const instructors = [
    {
      name: "אריאל \"סטינגר\"",
      role: "מומחה מיינקראפט",
      imageUrl: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "סטינגר הוא יוטיובר מיינקראפט מצליח עם 90 אלף עוקבים ביוטיוב, בעל ניסיון של מעל ל-10 שנים במשחק. מתמחה בבנייה ובשיטות הישרדות מתוחכמות.",
      socialLinks: [
        {
          platform: "tiktok",
          url: "https://tiktok.com/@stingeril",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
          )
        },
        {
          platform: "discord",
          url: "https://stingerisrael.co.il/discord",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 640 512">
              <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
            </svg>
          )
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@%D7%A1%D7%98%D7%99%D7%A0%D7%92%D7%A8",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512">
              <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
            </svg>
          )
        }
      ]
    },
    {
      name: "דניאל \"TeamBlast\"",
      role: "מומחה PVP",
      imageUrl: "https://images.pexels.com/photos/3771839/pexels-photo-3771839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "דניאל מ-TeamBlast התחיל את דרכו בעולם הגיימינג בשנת 2011, כשהוא נמשך בעיקר לפן ההישרדותי והמצב האולטרה הארדקור במיינקראפט. היה חבר בקבוצת לחימה מקצועית במיינקראפט בשם TEAM VURN.",
      socialLinks: [
        {
          platform: "tiktok",
          url: "https://www.tiktok.com/@teamblast",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
          )
        },
        {
          platform: "instagram",
          url: "https://www.instagram.com/daniel.teamblast/",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          )
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@teamblast",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512">
              <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
            </svg>
          )
        }
      ]
    },
    {
      name: "אדיר \"AdirTV\"",
      role: "חידושים וטריקים",
      imageUrl: "https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "אדיר AdirTV הוא שחקן מיינקראפט עם למעלה מ-10 שנות ניסיון במשחק. הוא מומחה לכל החידושים במיינקראפט ובעל ידע כללי ועובדות מעניינות על המשחק.",
      socialLinks: [
        {
          platform: "tiktok",
          url: "tiktok.com/@realadirtv",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
          )
        },
        {
          platform: "discord",
          url: "https://discord.adir.tv",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 640 512">
              <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
            </svg>
          )
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@AdirTV",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512">
              <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
            </svg>
          )
        }
      ]
    },
    {
      name: "אמרי \"קרייזיפיקסל\"",
      role: "מומחה PVP",
      imageUrl: "https://images.pexels.com/photos/3772511/pexels-photo-3772511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "אמרי קרייזיפיקסל הוא יוטיובר מיינקראפט מוביל עם ניסיון של 7 שנים במשחק. הוא מומחה ב-PVP, שהוא תחום הלחימה במשחק, ומכיר את כל הטכניקות והשיטות המתקדמות ביותר.",
      socialLinks: [
        {
          platform: "tiktok",
          url: "https://www.tiktok.com/@crazypixelyt",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
            </svg>
          )
        },
        {
          platform: "youtube",
          url: "https://www.youtube.com/@CrazyPixel",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 576 512">
              <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <section id="instructors" className="py-16 bg-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">המדריכים שלנו</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          המדריכים שלנו הם יוטיוברים מובילים בתחום המיינקראפט, עם שנים של ניסיון וידע רחב. 
          כל אחד מהם מומחה בתחום ספציפי במשחק ויעניק לילדכם חווית למידה מעשירה ומהנה.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <Instructor
              key={index}
              name={instructor.name}
              role={instructor.role}
              imageUrl={instructor.imageUrl}
              description={instructor.description}
              socialLinks={instructor.socialLinks}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;