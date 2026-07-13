const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qmldrssvbakgpdwmtirg.supabase.co', 'sb_publishable_IdmShADvlcjNTVnMAtN_hw_GeLZGd8C');

function rowToDoubt(row) {
  const deriveStatus = (row) => {
    if (row.status) return row.status;
    return row.is_answered ? 'answered' : 'submitted';
  };

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    topic: row.topic ?? undefined,
    question: row.question,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    answerText: row.answer_text ?? undefined,
    isAnswered: row.is_answered,
    status: deriveStatus(row),
    createdAt: row.created_at,
    replies: row.doubt_replies ? row.doubt_replies.map((reply) => ({
      id: reply.id,
      doubt_id: reply.doubt_id,
      professor_id: reply.professor_id,
      reply_text: reply.reply_text,
      created_at: reply.created_at,
      updated_at: reply.updated_at,
    })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : []
  };
}

async function test() {
  const { data } = await supabase.from('doubts').select('*, doubt_replies(*)').order('created_at', { ascending: false });
  const doubts = (data ?? []).map(rowToDoubt);

  const activeTab = 'All';
  const myEmail = null;
  const searchQuery = '';

  const valid = doubts.filter(d => {
    const sub = (d.subject || '').toLowerCase();
    if (sub === 'dfv' || sub === 'cv' || sub === 'sdsdv') return false;
    return true;
  });

  const tabMatchesDoubt = (tab, doubt, myEmail) => {
    const status = doubt.status;
    switch (tab) {
      case 'Waiting': return status === 'awaiting' || status === 'submitted' || status === 'needs-followup';
      case 'Answered': return status === 'answered';
      case 'My Questions': return myEmail ? doubt.email === myEmail : true;
      default: return true;
    }
  }

  const byTab = valid.filter(d => tabMatchesDoubt(activeTab, d, myEmail));

  const sorted = [...byTab].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log("Total fetched:", doubts.length);
  console.log("Valid:", valid.length);
  console.log("By Tab:", byTab.length);
  console.log("Sorted top 3:", JSON.stringify(sorted.slice(0, 3), null, 2));
}

test();
