import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {AppButton, Avatar, Txt} from '@components';
import {EScreen} from '@enums';
import {RootParamList} from '@navigation/RootNavigation';
import {tokens} from '@theme';
import {useMessage} from '@features/rescue';
import {useRatings} from '@features/profile';
import {useUsers} from '@features/auth';
import {themedStyles} from '../../theme/tokens';

const {colors, space, radius, type} = tokens;

type Route = RouteProp<RootParamList, EScreen.RESCUE_COMPLETED>;

const STAR_LABEL = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

const minutes = (from?: number, to?: number) =>
  from && to && to > from ? Math.max(1, Math.round((to - from) / 60000)) : null;

// Figma "Done / Thank you", turned into a rescue summary with a rating.
const RescueCompletedScreen = () => {
  const {goBack} = useNavigation();
  const {id} = useRoute<Route>().params;
  const {message} = useMessage(id);
  const {user: worker} = useUsers(message?.workerID);
  const {ratings, rate} = useRatings();

  const existing = ratings[id];
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(async () => {
    await rate(id, stars, comment.trim());
    setSent(true);
  }, [comment, id, rate, stars]);

  const took = minutes(message?.time, message?.endAt);
  const shownStars = existing?.stars ?? stars;
  const done = sent || Boolean(existing);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled">
        <View style={styles.check}>
          <Txt style={styles.checkMark} color={colors.success}>
            ✓
          </Txt>
        </View>
        <Txt variant="title" center accessibilityRole="header">
          You're all set
        </Txt>
        <Txt variant="body" color={colors.textMuted} center>
          Your rescue request is complete. Drive safely.
        </Txt>

        <View style={styles.card}>
          <Row label="Request" value={message?.type ?? '…'} />
          {message?.location?.description ? (
            <Row label="Where" value={message.location.description} />
          ) : null}
          {took ? <Row label="Time to finish" value={`${took} min`} /> : null}
          {worker ? (
            <View style={styles.worker}>
              <Avatar name={worker.displayName} uri={worker.photoURL} size={40} />
              <View style={styles.flex}>
                <Txt variant="caption" color={colors.textMuted}>
                  Helped by
                </Txt>
                <Txt variant="label">{worker.displayName || 'Rescue worker'}</Txt>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Txt variant="heading" center>
            {done ? 'Thanks for your feedback' : 'How was the rescue?'}
          </Txt>
          <View style={styles.stars} accessibilityRole="adjustable">
            {[1, 2, 3, 4, 5].map(n => (
              <Pressable
                key={n}
                disabled={done}
                hitSlop={4}
                onPress={() => setStars(n)}
                accessibilityRole="button"
                accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
                accessibilityState={{selected: shownStars >= n}}
                style={styles.star}>
                <Txt
                  style={styles.starText}
                  color={shownStars >= n ? colors.warning : colors.border}>
                  ★
                </Txt>
              </Pressable>
            ))}
          </View>
          <Txt variant="label" color={colors.textMuted} center>
            {STAR_LABEL[shownStars] || 'Tap a star'}
          </Txt>
          {!done && shownStars > 0 && (
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Anything we should know? (optional)"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={300}
              style={styles.input}
              accessibilityLabel="Comment"
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!done && (
          <AppButton
            label="Send rating"
            disabled={stars === 0}
            onPress={handleSubmit}
          />
        )}
        <AppButton
          label={done ? 'Back to home' : 'Skip'}
          variant={done ? 'primary' : 'ghost'}
          onPress={goBack}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const Row = ({label, value}: {label: string; value: string}) => (
  <View style={styles.row}>
    <Txt variant="caption" color={colors.textMuted}>
      {label}
    </Txt>
    <Txt variant="body">{value}</Txt>
  </View>
);

export default RescueCompletedScreen;

const styles = themedStyles(() => StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  body: {padding: space.xl, paddingTop: space.xxl, rowGap: space.lg},
  check: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successSoft,
  },
  checkMark: {fontSize: 44, lineHeight: 52, fontWeight: '700'},
  card: {
    padding: space.lg,
    rowGap: space.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  row: {rowGap: 2},
  worker: {flexDirection: 'row', alignItems: 'center', columnGap: space.md},
  flex: {flex: 1},
  stars: {flexDirection: 'row', justifyContent: 'center', columnGap: space.xs},
  star: {minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center'},
  starText: {fontSize: 36, lineHeight: 42},
  input: {
    minHeight: 88,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    color: colors.text,
    fontSize: type.body.fontSize,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.xl,
    rowGap: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
}));
