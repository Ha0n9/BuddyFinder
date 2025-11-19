import { useState } from "react";
import { getAllReports, updateReportStatus, banReportedUser } from "../../services/adminApi";
import { showError } from "../../utils/toast";

const statusOptions = ["OPEN", "UNDER_REVIEW", "ACTION_TAKEN", "RESOLVED"];

export default function ReportsTable({ reports, refresh }) {
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [banDays, setBanDays] = useState("3");
  const [processing, setProcessing] = useState(false);

  const openDetail = (report) => {
    setSelected(report);
    setAdminNotes(report.adminNotes || "");
  };

  const closeDetail = () => {
    setSelected(null);
    setAdminNotes("");
  };

  const handleStatusChange = async (status) => {
    if (!selected) return;
    setProcessing(true);
    try {
      await updateReportStatus(selected.reportId, { status, adminNotes });
      await refresh();
      const res = await getAllReports();
      const updated = (res.data || res).find((r) => r.reportId === selected.reportId);
      setSelected(updated);
    } catch (error) {
      console.error(error);
      showError("Failed to update report");
    } finally {
      setProcessing(false);
    }
  };

  const handleBan = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await banReportedUser(selected.reportId, { days: banDays, adminNotes });
      await refresh();
      closeDetail();
    } catch (error) {
      console.error(error);
      showError("Failed to ban user");
    } finally {
      setProcessing(false);
    }
  };

  if (!reports?.length) {
    return <p className="text-center text-gray-500 py-6">No reports found.</p>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50/60 dark:bg-neutral-950/20">
              <tr className="text-left text-neutral-600 dark:text-neutral-300">
                <th className="p-3">Reporter</th>
                <th className="p-3">Reported</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportId} className="border-t border-neutral-200/60 dark:border-neutral-800">
                  <td className="p-3">
                    <p className="font-semibold">{report.reporter.name}</p>
                    <p className="text-xs text-gray-500">{report.reporter.email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{report.reported.name}</p>
                    <p className="text-xs text-gray-500">{report.reported.email}</p>
                  </td>
                  <td className="p-3">{report.reason}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#FF5F00]/10 text-[#FF5F00]">
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openDetail(report)}
                      className="px-3 py-1.5 rounded-xl bg-[#FF5F00] text-white hover:bg-[#ff7133]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selected.reason}</h3>
                <p className="text-sm text-gray-400">
                  {selected.reporter.name} → {selected.reported.name}
                </p>
              </div>
              <button onClick={closeDetail} className="text-gray-400 hover:text-white">
                Close
              </button>
            </div>
            <div className="text-gray-300 text-sm mb-4">{selected.description}</div>
            {selected.attachmentUrl && (
              <a
                href={selected.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#FF5F00] underline"
              >
                View attachment
              </a>
            )}

            <div className="mt-5 space-y-3">
              <h4 className="text-white font-semibold">Messages</h4>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      msg.fromReporter ? 'bg-[#FF5F00]/10 text-[#FFAD80]' : 'bg-[#1F1F1F] text-gray-100'
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
                    <p className="text-[10px] text-gray-500 mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
                  rows="3"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    disabled={processing}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${
                      selected.status === status
                        ? 'bg-[#FF5F00] text-white'
                        : 'bg-[#2A2A2A] text-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={banDays}
                  onChange={(e) => setBanDays(e.target.value)}
                  className="p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
                >
                  <option value="3">Ban 3 days</option>
                  <option value="5">Ban 5 days</option>
                  <option value="7">Ban 7 days</option>
                </select>
                <button
                  onClick={handleBan}
                  disabled={processing}
                  className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 disabled:opacity-50"
                >
                  Ban Reported User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
