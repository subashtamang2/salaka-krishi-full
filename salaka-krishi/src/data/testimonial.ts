import image1  from "@assets/images/testimonial/shibu.jpg";
import image2 from "@assets/images/testimonial/dukpa.jpg";
import image3 from "@assets/images/testimonial/prabin.jpg";
import image4 from "@assets/images/testimonial/subash.jpg";
import image5 from "@assets/images/testimonial/punam.jpg";
import type { TestimonialSchema } from "@src/schema/schema";

export const Testimonials: TestimonialSchema[] = [
  {
    id: "t1",
    name: "Shibu Subba",
    role: "Operations Manager",
    message:
      "Salaka Krishi Limited has truly made my daily life easier. Their vegetables are always fresh, clean, and full of flavor. I also buy their dairy products regularly, and the quality is consistently excellent. Knowing that everything is organic gives me even more confidence. Highly recommended!",
    avatar: image2,
  },
  {
    id: "t2",
    name: "Dukpa Sherpa",
    role: "Supply Chain Coordinator",
    message:
      "Salaka Krishi focuses strongly on ethical sourcing and farmer support. Being part of a team that values sustainability and transparency is something I’m proud of.",
    avatar: image1,
  },
  {
    id: "t3",
    name: "Prabin BK",
    role: "Full Stack Developr",
    message:
      "Salaka Krishi Limited has truly made my daily life easier. Their vegetables are always fresh, clean, and full of flavor. I also buy their dairy products regularly, and the quality is consistently excellent. Knowing that everything is organic gives me even more confidence. Highly recommended!",
    avatar: image3,
  },
  {
    id: "t4",
    name: "Subash Tamang",
    role: "Frontend Developer",
    message:
      "Salaka Krishi Limited has truly made my daily life easier. Their vegetables are always fresh, clean, and full of flavor. I also buy their dairy products regularly, and the quality is consistently excellent. Knowing that everything is organic gives me even more confidence. Highly recommended!",
    avatar: image4,
  },
  {
    id: "t5",
    name: "Punam Bomjan",
    role: "Customer Support Executive",
    message:
      "Salaka Krishi Limited has truly made my daily life easier. Their vegetables are always fresh, clean, and full of flavor. I also buy their dairy products regularly, and the quality is consistently excellent. Knowing that everything is organic gives me even more confidence. Highly recommended!",
    avatar: image5,
  },
];
