import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from './theme';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  
  scrollContainer: {
    flexGrow: 1,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  // Typography styles
  heading1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
  },
  
  heading2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight * typography.fontSize['3xl'],
  },
  
  heading3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
  },
  
  heading4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xl,
  },
  
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
  
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    color: colors.textMuted,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
  
  // Text variants
  textPrimary: {
    color: colors.textPrimary,
  },
  
  textSecondary: {
    color: colors.textSecondary,
  },
  
  textMuted: {
    color: colors.textMuted,
  },
  
  textLight: {
    color: colors.textLight,
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  textBold: {
    fontWeight: typography.fontWeight.bold,
  },
  
  textSemibold: {
    fontWeight: typography.fontWeight.semibold,
  },
  
  textMedium: {
    fontWeight: typography.fontWeight.medium,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  justifyCenter: {
    justifyContent: 'center',
  },
  
  justifyBetween: {
    justifyContent: 'space-between',
  },
  
  justifyAround: {
    justifyContent: 'space-around',
  },
  
  alignCenter: {
    alignItems: 'center',
  },
  
  alignStart: {
    alignItems: 'flex-start',
  },
  
  alignEnd: {
    alignItems: 'flex-end',
  },
  
  flex1: {
    flex: 1,
  },
  
  flexGrow1: {
    flexGrow: 1,
  },
  
  flexShrink0: {
    flexShrink: 0,
  },
  
  // Spacing styles
  margin0: { margin: 0 },
  marginXs: { margin: spacing.xs },
  marginSm: { margin: spacing.sm },
  marginMd: { margin: spacing.md },
  marginBase: { margin: spacing.base },
  marginLg: { margin: spacing.lg },
  marginXl: { margin: spacing.xl },
  margin2xl: { margin: spacing['2xl'] },
  
  marginTop0: { marginTop: 0 },
  marginTopXs: { marginTop: spacing.xs },
  marginTopSm: { marginTop: spacing.sm },
  marginTopMd: { marginTop: spacing.md },
  marginTopBase: { marginTop: spacing.base },
  marginTopLg: { marginTop: spacing.lg },
  marginTopXl: { marginTop: spacing.xl },
  marginTop2xl: { marginTop: spacing['2xl'] },
  
  marginBottom0: { marginBottom: 0 },
  marginBottomXs: { marginBottom: spacing.xs },
  marginBottomSm: { marginBottom: spacing.sm },
  marginBottomMd: { marginBottom: spacing.md },
  marginBottomBase: { marginBottom: spacing.base },
  marginBottomLg: { marginBottom: spacing.lg },
  marginBottomXl: { marginBottom: spacing.xl },
  marginBottom2xl: { marginBottom: spacing['2xl'] },
  
  padding0: { padding: 0 },
  paddingXs: { padding: spacing.xs },
  paddingSm: { padding: spacing.sm },
  paddingMd: { padding: spacing.md },
  paddingBase: { padding: spacing.base },
  paddingLg: { padding: spacing.lg },
  paddingXl: { padding: spacing.xl },
  padding2xl: { padding: spacing['2xl'] },
  
  paddingHorizontal0: { paddingHorizontal: 0 },
  paddingHorizontalXs: { paddingHorizontal: spacing.xs },
  paddingHorizontalSm: { paddingHorizontal: spacing.sm },
  paddingHorizontalMd: { paddingHorizontal: spacing.md },
  paddingHorizontalBase: { paddingHorizontal: spacing.base },
  paddingHorizontalLg: { paddingHorizontal: spacing.lg },
  paddingHorizontalXl: { paddingHorizontal: spacing.xl },
  paddingHorizontal2xl: { paddingHorizontal: spacing['2xl'] },
  
  paddingVertical0: { paddingVertical: 0 },
  paddingVerticalXs: { paddingVertical: spacing.xs },
  paddingVerticalSm: { paddingVertical: spacing.sm },
  paddingVerticalMd: { paddingVertical: spacing.md },
  paddingVerticalBase: { paddingVertical: spacing.base },
  paddingVerticalLg: { paddingVertical: spacing.lg },
  paddingVerticalXl: { paddingVertical: spacing.xl },
  paddingVertical2xl: { paddingVertical: spacing['2xl'] },
  
  // Border styles
  border: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  
  // Background styles
  bgSurface: {
    backgroundColor: colors.surface,
  },
  
  bgSurfaceAlt: {
    backgroundColor: colors.surfaceAlt,
  },
  
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  
  bgSecondary: {
    backgroundColor: colors.secondary,
  },
  
  bgSuccess: {
    backgroundColor: colors.success,
  },
  
  bgWarning: {
    backgroundColor: colors.warning,
  },
  
  bgError: {
    backgroundColor: colors.error,
  },
  
  bgTransparent: {
    backgroundColor: 'transparent',
  },
});