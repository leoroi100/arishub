import styles from "./feature-card.module.css";

type FeatureCardProps = {
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
};

export function FeatureCard({
  kicker,
  title,
  description,
  bullets,
}: FeatureCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.kicker}>{kicker}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.list}>
        {bullets.map((item) => (
          <li className={styles.item} key={item}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
