import { useEffect, useState } from 'react';
import {
  getFiledReports,
  getReportsAgainstMe,
  addReportMessage,
  getReportById,
} from '../services/api';
import { showError, showSuccess } from '../utils/toast';

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [filed, setFiled] = useState([]);
  const [against, setAgainst] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [sending, setSending] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [filedRes, againstRes] = await Promise.all([
        getFiledReports(),
        getReportsAgainstMe(),
      ]);
      setFiled(filedRes.data || filedRes);
      setAgainst(againstRes.data || againstRes);
    } catch (error) {
      console.error('Failed to load reports', error);
      showError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const openReport = async (reportId) => {
    try {
      const response = await getReportById(reportId);
      setSelected(response.data || response);
      setMessage('');
      setAttachmentUrl('');
    } catch (error) {
      console.error('Failed to load report detail', error);
      showError('Failed to load report detail');
    }
  };

  const handleSendMessage = async () => {
    if (!selected) return;
    if (!message.trim() && !attachmentUrl.trim()) {
      showError('Provide message or attachment');
      return;
    }
    setSending(true);
    try {
      const response = await addReportMessage(selected.reportId, {
        message,
        attachmentUrl,
      });
      setSelected(response.data || response);
      showSuccess('Message sent to admin');
      setMessage('');
      setAttachmentUrl('');
    } catch (error) {
      console.error('Failed to send message', error);
      showError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]" />
      </div>
    );
  }

  const renderReportCard = (report) => (
    <div
      key={report.reportId}
      className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#FF5F00] transition"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-white font-semibold">{report.reason}</p>
          <p className="text-xs text-gray-400">
            {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#FF5F00]/15 text-[#FF5F00] font-bold">
          {report.status}
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{report.description}</p>
      <button
        onClick={() => openReport(report.reportId)}
        className="text-sm font-bold text-[#FF5F00] hover:text-white"
      >
        View Details
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-[#FF5F00] mb-2">Report Center</h1>
          <p className="text-gray-400">
            Track reports you submitted or disputes involving you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Reports You Filed</h2>
            {filed.length === 0 ? (
              <p className="text-gray-500 text-sm">You haven’t filed any reports.</p>
            ) : (
              <div className="space-y-3">{filed.map(renderReportCard)}</div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Reports Against You</h2>
            {against.length === 0 ? (
              <p className="text-gray-500 text-sm">No reports registered against you.</p>
            ) : (
              <div className="space-y-3">{against.map(renderReportCard)}</div>
            )}
          </div>
        </div>

        {selected && (
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selected.reason}</h3>
                <p className="text-sm text-gray-400">
                  Reported by {selected.reporter.name} • Against {selected.reported.name}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {selected.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.fromReporter ? 'bg-[#FF5F00]/10 text-[#FFAD80]' : 'bg-[#1F1F1F] text-gray-200'
                  }`}
                >
                  <p className="font-semibold text-xs mb-1">{msg.senderName}</p>
                  <p>{msg.message}</p>
                  {msg.attachmentUrl && (
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#FF5F00] underline"
                    >
                      View attachment
                    </a>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-white"
                rows="3"
                placeholder="Add a message or dispute..."
              />
              <input
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-white"
                placeholder="Image URL (optional)"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="px-6 py-3 rounded-2xl bg-[#FF5F00] text-white font-bold hover:bg-[#ff7133] disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;
