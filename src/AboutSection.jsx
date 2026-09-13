import './Homepage.css';

const rules = [
  {
    title: '1 § Name and domicile',
    content: (
      <p>The name of the association is Vesijärven Academic Kippistely Association VAKA ry and its domicile is Lahti.</p>
    ),
  },
  {
    title: '2 § Purpose and activities',
    content: (
      <>
        <ul>
          <li>Organizes courses, training, and teaching sessions</li>
          <li>Arranges competitions, trips, camps, and events</li>
          <li>Hosts parties, concerts, and exhibitions</li>
          <li>Maintains communication channels and publications</li>
          <li>Advises and guides members</li>
          <li>Participates in public discussion</li>
          <li>Conducts research and shares information</li>
          <li>Cooperates with organizations and authorities</li>
          <li>Preserves Lahti student culture</li>
        </ul>
        <p>To support its activities, the association may organize fundraisers, accept donations, sell advertising, and enter sponsorship agreements.</p>
      </>
    ),
  },
  {
    title: '3 § Members',
    content: <p>Members are accepted by the board. Supporting members and honorary members may also be included.</p>,
  },
  {
    title: '4 § Membership fees',
    content: <p>Fees are decided annually. Honorary members do not pay fees.</p>,
  },
  {
    title: '5 § Board',
    content: <p>The board consists of a chairman and 3–10 members. It manages the association and meets as needed.</p>,
  },
  {
    title: '6 § Signing authority',
    content: <p>The association is represented by designated board members.</p>,
  },
  {
    title: '7 § Fiscal period',
    content: <p>1 June – 31 May.</p>,
  },
  {
    title: '8–10 § Meetings',
    content: <p>The association holds spring and autumn meetings. Members vote, and decisions are made by majority.</p>,
  },
  {
    title: '11 § Changes and dissolution',
    content: <p>Rule changes require a 3/4 majority. Assets are used to support the association’s purpose.</p>,
  },
];

export default function AboutSection() {
  return (
    <section className="home-section about-section" id="about" aria-labelledby="about-heading">
      <div className="home-section__texture about-section__texture" aria-hidden="true" />

      <header className="about-section__header">
        <h1 id="about-heading">About</h1>
      </header>

      <article className="about-purpose">
        <div className="about-purpose__content">
          <p className="about-purpose__lead">
            Vesijärven Academic Kippistely Association VAKA ry is an association that aims to promote and support the student culture and activities for LUT &amp; LAB higher education students.
          </p>
          <div className="about-purpose__supporting">
            <p>The purpose of the activities is not to generate profit or provide financial benefit to the membership.</p>
            <p>Anyone who is a current or former student of LUT university or LAB university of Applied Sciences, and wishes to support the purpose of the association, can become a member.</p>
          </div>
        </div>
      </article>

      <details className="about-rules">
        <summary>
          <span className="about-rules__title">Rules and Statutes</span>
          <span className="about-rules__icon" aria-hidden="true" />
        </summary>

        <div className="about-rules__content">
          {rules.map((rule) => (
            <article className="about-rule" key={rule.title}>
              <h3>{rule.title}</h3>
              <div>{rule.content}</div>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
