// import { IconCookie, IconGauge, IconLock, IconMessage2, IconUser } from '@tabler/icons-react';
import {
  IconChartBar,
  IconDatabaseImport,
  IconLayoutDashboard,
  IconLock,
  IconArticle,
} from '@tabler/icons-react';
import { Container, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './FeaturesGrid.module.scss';

export const MOCKDATA = [
  {
    icon: IconDatabaseImport,
    title: 'Seamless Data Uploads',
    description:
      'Import large Excel, CSV, or JSON files in seconds. Our engine automatically parses and prepares your data for insights—no technical setup required.',
  },
  {
    icon: IconLayoutDashboard,
    title: 'Interactive Dashboards',
    description:
      'Turn raw spreadsheets into clean, interactive dashboards with filters, visualizations, and KPIs—instantly and without writing code.',
  },
  {
    icon: IconLock,
    title: 'Private & Secure',
    description:
      'Your data is encrypted and processed securely. We never share it with third parties, and you control when and how it’s used.',
  },
  {
    icon: IconArticle,
    title: 'Data-Driven Blog',
    description:
      'Explore our blog filled with tips, tutorials, and case studies on dashboard design, data storytelling, and productivity.',
  },
  {
    icon: IconChartBar,
    title: 'Optimized for Scale',
    description:
      'Whether it’s 1,000 or 1,000,000 rows, our engine is built for performance. Enjoy blazing-fast insights even with large datasets.',
  },
];



export function Feature({ icon: Icon, title, description }) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size={18} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export default function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
  <Title className={classes.title}>Transform your data into dashboards with zero hassle</Title>

  <Container size={560} p={0}>
    <Text size="sm" className={classes.description}>
      Upload your Excel, CSV, or JSON files and instantly generate insightful, interactive dashboards. No coding, no setup—just powerful, visual data exploration at your fingertips.
    </Text>
  </Container>

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 'xl', md: 50 }}
        verticalSpacing={{ base: 'xl', md: 50 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}