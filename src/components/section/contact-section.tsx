import { DATA } from "@/data/resume";
export default function ContactSection() {
  return (
    <section id="contact">
      <h2>一起聊聊视觉与机器人。</h2>
      <p>
        <a href={"mailto:" + DATA.contact.email}>{DATA.contact.email}</a>
      </p>
    </section>
  );
}
