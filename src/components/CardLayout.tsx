/**
 * CardLayout component for flexible card-based layouts
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import type {
  CardLayoutProps,
  BadgeConfig,
  CardSectionConfig,
  CardLayoutConfig,
} from '../types';
import { DEFAULT_CARD_LAYOUT, DEFAULT_CARD_SECTION } from '../types';

/**
 * Badge component for displaying status, tags, or indicators
 */
const Badge: React.FC<BadgeConfig & { onPress?: () => void }> = ({
  text,
  color = '#ffffff',
  backgroundColor = '#007AFF',
  size = 'medium',
  style,
  textStyle,
  onPress,
}) => {
  const badgeStyle = useMemo(() => {
    const sizeStyles = {
      small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
      medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
      large: { paddingHorizontal: 10, paddingVertical: 6, fontSize: 14 },
    };

    return [
      styles.badge,
      {
        backgroundColor,
        ...sizeStyles[size],
      },
      style,
    ];
  }, [backgroundColor, size, style]);

  const badgeTextStyle = useMemo(
    () => [
      styles.badgeText,
      {
        color,
        fontSize: size === 'small' ? 10 : size === 'medium' ? 12 : 14,
      },
      textStyle,
    ],
    [color, size, textStyle]
  );

  const BadgeComponent = (
    <View style={badgeStyle}>
      <Text style={badgeTextStyle}>{text}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.badgeContainer}>
        {BadgeComponent}
      </TouchableOpacity>
    );
  }

  return BadgeComponent;
};

/**
 * Default badges renderer
 */
const DefaultBadges: React.FC<{ badges: BadgeConfig[] }> = ({ badges }) => {
  return (
    <View style={styles.badgesContainer}>
      {badges.map((badge, index) => (
        <Badge key={index} {...badge} />
      ))}
    </View>
  );
};

/**
 * Card section wrapper component
 */
const CardSection: React.FC<{
  config: CardSectionConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  const { visible = true, style, padding, margin } = config;

  const sectionStyle = useMemo(
    () => [
      {
        padding: padding || DEFAULT_CARD_SECTION.padding,
        margin: margin || DEFAULT_CARD_SECTION.margin,
      },
      style,
    ],
    [padding, margin, style]
  );

  if (!visible) return null;

  return <View style={sectionStyle}>{children}</View>;
};

/**
 * Main CardLayout component
 */
const CardLayout: React.FC<CardLayoutProps> = ({
  // Title props
  title,
  titleStyle,
  titleContainerStyle,
  titleSection = DEFAULT_CARD_SECTION,

  // Description props
  description,
  descriptionStyle,
  descriptionContainerStyle,
  descriptionSection = DEFAULT_CARD_SECTION,

  // Badges props
  badges,
  badgesArray,
  badgesContainerStyle,
  badgesSection = DEFAULT_CARD_SECTION,

  // Custom component props
  customComponent,
  customComponentContainerStyle,
  customComponentSection = DEFAULT_CARD_SECTION,

  // Hitman props
  hitman,
  hitmanContainerStyle,
  hitmanSection = DEFAULT_CARD_SECTION,

  // Card layout configuration
  cardLayout = DEFAULT_CARD_LAYOUT,

  // Accessibility
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,

  // Interaction handlers
  onPress,
  onLongPress,

  // Animation
  animated = false,
  animationDuration = 300,
  animationType = 'fade',

  // Theme
  theme = 'light',
  themeColors,

  // Children (alternative approach)
  children,

  // Container style
  style,

  // Test ID
  testID,
}) => {
  // Merge card layout with defaults
  const mergedCardLayout: CardLayoutConfig = useMemo(
    () => ({
      ...DEFAULT_CARD_LAYOUT,
      ...cardLayout,
    }),
    [cardLayout]
  );

  // Theme colors
  const resolvedThemeColors = useMemo(() => {
    const defaultColors =
      theme === 'dark'
        ? {
            background: '#1c1c1e',
            text: '#ffffff',
            border: '#38383a',
            shadow: '#000000',
          }
        : {
            background: '#ffffff',
            text: '#000000',
            border: '#e1e4e8',
            shadow: '#000000',
          };

    return {
      ...defaultColors,
      ...themeColors,
    };
  }, [theme, themeColors]);

  // Card container style
  const cardContainerStyle = useMemo(
    () => [
      styles.cardContainer,
      {
        backgroundColor: resolvedThemeColors.background,
        borderColor: resolvedThemeColors.border,
        borderWidth: mergedCardLayout.borderWidth,
        borderRadius: mergedCardLayout.borderRadius,
        padding: mergedCardLayout.padding,
        margin: mergedCardLayout.margin,
        width: mergedCardLayout.width,
        height: mergedCardLayout.height,
      },
      mergedCardLayout.shadow && {
        ...Platform.select({
          ios: {
            shadowColor: resolvedThemeColors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: mergedCardLayout.elevation || 2,
          },
        }),
      },
      mergedCardLayout.style,
      style,
    ],
    [resolvedThemeColors, mergedCardLayout, style]
  );

  // Collect all sections and sort by order
  const sections = useMemo(() => {
    const sectionArray = [];

    // Title section
    if (title) {
      sectionArray.push({
        key: 'title',
        order: titleSection.order || 0,
        component: (
          <CardSection key="title-section" config={titleSection}>
            <View style={titleContainerStyle}>
              {typeof title === 'string' ? (
                <Text
                  style={[
                    styles.title,
                    { color: resolvedThemeColors.text },
                    titleStyle,
                  ]}
                >
                  {title}
                </Text>
              ) : (
                title
              )}
            </View>
          </CardSection>
        ),
      });
    }

    // Description section
    if (description) {
      sectionArray.push({
        key: 'description',
        order: descriptionSection.order || 1,
        component: (
          <CardSection key="description-section" config={descriptionSection}>
            <View style={descriptionContainerStyle}>
              {typeof description === 'string' ? (
                <Text
                  style={[
                    styles.description,
                    { color: resolvedThemeColors.text },
                    descriptionStyle,
                  ]}
                >
                  {description}
                </Text>
              ) : (
                description
              )}
            </View>
          </CardSection>
        ),
      });
    }

    // Badges section
    if (badges || badgesArray) {
      sectionArray.push({
        key: 'badges',
        order: badgesSection.order || 2,
        component: (
          <CardSection key="badges-section" config={badgesSection}>
            <View style={badgesContainerStyle}>
              {badges ||
                (badgesArray && <DefaultBadges badges={badgesArray} />)}
            </View>
          </CardSection>
        ),
      });
    }

    // Custom component section
    if (customComponent) {
      sectionArray.push({
        key: 'custom',
        order: customComponentSection.order || 3,
        component: (
          <CardSection key="custom-section" config={customComponentSection}>
            <View style={customComponentContainerStyle}>{customComponent}</View>
          </CardSection>
        ),
      });
    }

    // Hitman section (always last)
    if (hitman) {
      sectionArray.push({
        key: 'hitman',
        order: hitmanSection.order || 999,
        component: (
          <CardSection key="hitman-section" config={hitmanSection}>
            <View style={hitmanContainerStyle}>{hitman}</View>
          </CardSection>
        ),
      });
    }

    // Sort by order
    return sectionArray.sort((a, b) => a.order - b.order);
  }, [
    title,
    description,
    badges,
    badgesArray,
    customComponent,
    hitman,
    titleSection,
    descriptionSection,
    badgesSection,
    customComponentSection,
    hitmanSection,
    titleContainerStyle,
    descriptionContainerStyle,
    badgesContainerStyle,
    customComponentContainerStyle,
    hitmanContainerStyle,
    titleStyle,
    descriptionStyle,
    resolvedThemeColors,
  ]);

  // Animation value
  const animationValue = useMemo(() => new Animated.Value(0), []);

  // Animate on mount
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: animationType === 'fade' || animationType === 'scale',
      }).start();
    }
  }, [animated, animationValue, animationDuration, animationType]);

  // Animation style
  const animationStyle = useMemo(() => {
    if (!animated) return {};

    switch (animationType) {
      case 'fade':
        return { opacity: animationValue };
      case 'scale':
        return { transform: [{ scale: animationValue }] };
      case 'slide':
        return {
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      default:
        return {};
    }
  }, [animated, animationType, animationValue]);

  // Main content
  const content = children || sections.map((section) => section.component);

  // Wrap in TouchableOpacity if onPress or onLongPress is provided
  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole as any}
        testID={testID}
        style={animated ? animationStyle : undefined}
      >
        <Animated.View style={cardContainerStyle}>{content}</Animated.View>
      </TouchableOpacity>
    );
  }

  // Static card
  return (
    <Animated.View
      style={[cardContainerStyle, animationStyle]}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole as any}
      testID={testID}
    >
      {content}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    padding: 16,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  badge: {
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeContainer: {
    // No additional styles needed
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default CardLayout;
