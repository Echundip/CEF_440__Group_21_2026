import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type Message = {
  id: string;
  sender: string;
  initials: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  avatarColor: string;
};

const messages: Message[] = [
  {
    id: '1', sender: 'Dr. A. Mbarga', initials: 'AM', role: 'Mobile Dev',
    preview: 'Assignment deadline has been extended to Friday. Please submit your project on the portal.',
    time: '2 min ago', unread: 2, avatarColor: colors.navy,
  },
  {
    id: '2', sender: 'Prof. N. Foncha', initials: 'NF', role: 'Networks & QoE',
    preview: 'New course materials have been uploaded. Check the resources section.',
    time: '1 hr ago', unread: 1, avatarColor: colors.navyLight,
  },
  {
    id: '3', sender: 'Dr. E. Tabe', initials: 'ET', role: 'Database Systems',
    preview: 'Quiz 2 results are now available. Average score was 74%.',
    time: '1 day ago', unread: 0, avatarColor: colors.accent,
  },
  {
    id: '4', sender: 'System', initials: 'SY', role: 'EduStream',
    preview: 'Your network quality has been optimized for low bandwidth. Audio mode is active.',
    time: '2 days ago', unread: 0, avatarColor: colors.textMuted,
  },
];

export function MessagesScreen() {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string | null>(null);

  const filtered = messages.filter(
    (m) =>
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUnread = messages.reduce((s, m) => s + m.unread, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Messages</Text>
          {totalUnread > 0 && (
            <Text style={styles.subtitle}>{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</Text>
          )}
        </View>
        <Pressable style={styles.composeBtn}>
          <Ionicons name="create-outline" size={22} color={colors.navy} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages…"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((msg) => (
          <Pressable
            key={msg.id}
            style={[styles.card, active === msg.id && styles.cardActive]}
            onPress={() => setActive(active === msg.id ? null : msg.id)}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: msg.avatarColor }]}>
              <Text style={styles.avatarText}>{msg.initials}</Text>
            </View>

            {/* Content */}
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.senderName}>{msg.sender}</Text>
                <Text style={styles.time}>{msg.time}</Text>
              </View>
              <Text style={styles.role}>{msg.role}</Text>
              <Text
                style={[styles.preview, msg.unread > 0 && styles.previewBold]}
                numberOfLines={active === msg.id ? undefined : 2}
              >
                {msg.preview}
              </Text>
            </View>

            {/* Unread badge */}
            {msg.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{msg.unread}</Text>
              </View>
            )}
          </Pressable>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.border} />
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.moderate, marginTop: 2 },
  composeBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: 14, color: colors.text },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadow,
  },
  cardActive: { borderWidth: 1.5, borderColor: colors.accent },

  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0,
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 16 },

  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  senderName: { fontSize: 15, fontWeight: '700', color: colors.text },
  time: { fontSize: 11, color: colors.textMuted },
  role: { fontSize: 12, color: colors.accent, fontWeight: '600', marginTop: 1, marginBottom: 4 },
  preview: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  previewBold: { color: colors.text, fontWeight: '600' },

  badge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.navy, alignItems: 'center',
    justifyContent: 'center', marginLeft: spacing.sm, flexShrink: 0,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },

  empty: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.md },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
