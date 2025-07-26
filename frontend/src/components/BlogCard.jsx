import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import {
    ActionIcon,
    Avatar,
    Badge,
    Card,
    Center,
    Group,
    Image,
    Text,
    useMantineTheme,
} from '@mantine/core';
import classes from './BlogCard.module.scss';



export function BlogCard({
    imageUrl,
    imageHeight = 200,
    linkUrl,
    badgeText,
    badgeGradient = { from: 'yellow', to: 'red' },
    title,
    description,
    authorName,
    authorAvatar,
    descriptionLineClamp = 4,
}) {
    const linkProps = { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' };
    const theme = useMantineTheme();

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section style={{ padding: 10, borderBottom: '1px solid #eaeaea' }}>
                <a {...linkProps}>
                    <Image src={imageUrl} height={imageHeight} style={{borderRadius: 10}}/>
                </a>
            </Card.Section>

            <Badge className={classes.rating} variant="gradient" gradient={badgeGradient}>
                {badgeText}
            </Badge>

            <Text className={classes.title} fw={500} component="a" {...linkProps}>
                {title}
            </Text>

            <Text fz="sm" c="dimmed" lineClamp={descriptionLineClamp}>
                {description}
            </Text>

            <Group justify="space-between" className={classes.footer}>
                <Center>
                    <Avatar
                        src={authorAvatar}
                        size={24}
                        radius="xl"
                        mr="xs"
                    />
                    <Text fz="sm" inline>
                        {authorName}
                    </Text>
                </Center>

                <Group gap={8} mr={0}>
                    <ActionIcon className={classes.action}>
                        <IconHeart size={16} color={theme.colors.red[6]} />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <IconBookmark size={16} color={theme.colors.yellow[7]} />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <IconShare size={16} color={theme.colors.blue[6]} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    );
}