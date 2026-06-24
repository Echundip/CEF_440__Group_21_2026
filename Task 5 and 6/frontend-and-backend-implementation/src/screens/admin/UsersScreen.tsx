import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { USERS } from './users';
import {
  Card,
  CardTitle,
  ProgressRow,
  StatusBadge,
  SectionLabel,
  MetricGrid,
} from '../../components/SharedComponents';
import { colors, radius } from '../../theme/theme'

const FILTERS = ['All', 'Student', 'Lecturer', 'Admin', 'Active', 'Pending', 'Suspended'];

export default function UsersScreen() {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  type User = (typeof USERS)[number];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      const mf =
        filter === 'All' || u.role === filter || u.status === filter;
      const q = search.toLowerCase();
      const ms =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.dept.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return mf && ms;
    });
  }, [filter, search]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionLabel text="Account Management" />

      <MetricGrid
        items={[
          { label: 'Total Users', value: '12,847', valueColor: colors.accent, sub: '↑ 3.2% this month', subType: 'up' },
          { label: 'Active Now', value: '1,204', valueColor: colors.green, sub: 'Live sessions' },
          { label: 'Pending', value: '38', valueColor: colors.amber, sub: 'Needs action', subType: 'dn' },
          { label: 'Suspended', value: '12', valueColor: colors.red, sub: 'Violations' },
        ]}
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, departments..."
          placeholderTextColor={colors.text3}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.fpill, filter === f && styles.fpillOn]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.fpillText, filter === f && styles.fpillTextOn]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User list */}
      <Card>
        <CardTitle title="User Accounts" />
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No users match</Text>
        ) : (
          filtered.map((u, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.urow, i === filtered.length - 1 && styles.urowLast]}
              onPress={() => setSelectedUser(u)}
              activeOpacity={0.7}
            >
              <View style={[styles.uav, { backgroundColor: u.color }]}>
                <Text style={styles.uavText}>{u.initials}</Text>
              </View>
              <View style={styles.uinfo}>
                <Text style={styles.uname}>{u.name}</Text>
                <Text style={styles.urole}>{u.role} · {u.dept}</Text>
              </View>
              <StatusBadge status={u.status} />
            </TouchableOpacity>
          ))
        )}
      </Card>

      {/* Role distribution */}
      <Card>
        <CardTitle title="Role Distribution" />
        <ProgressRow label="Students" right="9,214 (71%)" pct={71} fillColor={colors.cyan} />
        <ProgressRow label="Lecturers" right="1,843 (14%)" pct={14} fillColor={colors.accent} />
        <ProgressRow label="Admins" right="1,790 (15%)" pct={15} fillColor={colors.purple} />
      </Card>

      {/* User detail modal */}
      <Modal visible={!!selectedUser} transparent animationType="slide" onRequestClose={() => setSelectedUser(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedUser(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalAv, { backgroundColor: selectedUser.color }]}>
                    <Text style={styles.modalAvText}>{selectedUser.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalName}>{selectedUser.name}</Text>
                    <Text style={styles.modalRole}>{selectedUser.role} · {selectedUser.dept}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {[
                  { icon: '✉', label: 'Email', value: selectedUser.email, valueColor: colors.accent },
                  { icon: '📞', label: 'Phone', value: selectedUser.phone },
                  { icon: '📅', label: 'Joined', value: selectedUser.joined },
                  { icon: '📚', label: 'Courses', value: selectedUser.courses },
                  { icon: '💻', label: 'Sessions', value: selectedUser.sessions },
                ].map((f, i) => (
                  <View key={i} style={styles.mfield}>
                    <Text style={styles.mfIcon}>{f.icon}</Text>
                    <Text style={styles.mflbl}>{f.label}</Text>
                    <Text style={[styles.mfval, f.valueColor && { color: f.valueColor }]}>
                      {f.value}
                    </Text>
                  </View>
                ))}

                <View style={styles.mfield}>
                  <Text style={styles.mfIcon}>⚡</Text>
                  <Text style={styles.mflbl}>Status</Text>
                  <StatusBadge status={selectedUser.status} />
                </View>

                <View style={styles.mActRow}>
                  <TouchableOpacity style={[styles.mbtn, styles.mbtnEdit]} onPress={() => setSelectedUser(null)}>
                    <Text style={styles.mbtnEditText}>✏ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mbtn, styles.mbtnMsg]} onPress={() => setSelectedUser(null)}>
                    <Text style={styles.mbtnMsgText}>✉ Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mbtn, styles.mbtnSus]} onPress={() => setSelectedUser(null)}>
                    <Text style={styles.mbtnSusText}>
                      {selectedUser.status === 'Suspended' ? '✓ Restore' : '⊗ Suspend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 11, backgroundColor: colors.bg },
  searchWrap: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border2,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  searchInput: {
    fontSize: 12,
    color: colors.text,
    padding: 0,
  },
  filterRow: { gap: 5, paddingBottom: 8, flexDirection: 'row' },
  fpill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.bgCard,
  },
  fpillOn: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },
  fpillText: { fontSize: 10, color: colors.text2, fontWeight: '500' },
  fpillTextOn: { color: colors.accent },
  urow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  urowLast: { borderBottomWidth: 0 },
  uav: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uavText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  uinfo: { flex: 1 },
  uname: { fontSize: 12, fontWeight: '500', color: colors.text },
  urole: { fontSize: 10, color: colors.text3 },
  emptyText: { fontSize: 12, color: colors.text3, textAlign: 'center', padding: 16 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 32,
    height: 3,
    backgroundColor: colors.border2,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  modalAv: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  modalAvText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  modalName: { fontSize: 14, fontWeight: '600', color: colors.text },
  modalRole: { fontSize: 11, color: colors.text3, marginTop: 2 },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 11, color: colors.text2 },
  mfield: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mfIcon: { fontSize: 13, width: 20 },
  mflbl: { flex: 1, fontSize: 10, color: colors.text3 },
  mfval: { fontSize: 11, fontWeight: '500', color: colors.text },
  mActRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  mbtn: { flex: 1, paddingVertical: 7, borderRadius: 10, alignItems: 'center' },
  mbtnEdit: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border2 },
  mbtnEditText: { fontSize: 11, fontWeight: '600', color: colors.text2 },
  mbtnMsg: { backgroundColor: colors.accentLight },
  mbtnMsgText: { fontSize: 11, fontWeight: '600', color: colors.accent },
  mbtnSus: { backgroundColor: colors.redLight },
  mbtnSusText: { fontSize: 11, fontWeight: '600', color: '#b91c1c' },
});
