const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  auth: {
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },

  dashboard: {
    student: (studentId) => request(`/dashboard?studentId=${studentId}`),
    instructor: (lecturerId) => request(`/dashboard?lecturerId=${lecturerId}`),
  },

  students: {
    list: () => request('/students'),
    create: (body) => request('/students', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  },

  lecturers: {
    list: () => request('/lecturers'),
    create: (body) => request('/lecturers', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => request(`/lecturers/${id}`, { method: 'DELETE' }),
  },

  courses: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/courses${q ? `?${q}` : ''}`);
    },
    get: (id) => request(`/courses/${id}`),
    create: (body) => request('/courses', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
    enroll: (courseId, studentId) =>
      request(`/courses/${courseId}/enroll`, { method: 'POST', body: JSON.stringify({ studentId }) }),
    students: (courseId) => request(`/courses/${courseId}/students`),
    gradebook: (courseId) => request(`/courses/${courseId}/gradebook`),
  },

  assignments: {
    byCourse: (courseId, published) =>
      request(`/assignments/course/${courseId}${published ? '?published=true' : ''}`),
    forStudent: (studentId) => request(`/assignments/student/${studentId}`),
    create: (courseId, body) =>
      request(`/assignments/course/${courseId}`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id) => request(`/assignments/${id}`, { method: 'DELETE' }),
    submissions: (assignmentId) => request(`/assignments/${assignmentId}/submissions`),
    submit: (assignmentId, body) =>
      request(`/assignments/${assignmentId}/submissions`, { method: 'POST', body: JSON.stringify(body) }),
  },

  submissions: {
    grade: (id, body) => request(`/submissions/${id}/grade`, { method: 'PUT', body: JSON.stringify(body) }),
    grades: (studentId) => request(`/submissions/student/${studentId}/grades`),
  },

  announcements: {
    byCourse: (courseId) => request(`/announcements/course/${courseId}`),
    create: (courseId, body) =>
      request(`/announcements/course/${courseId}`, { method: 'POST', body: JSON.stringify(body) }),
    remove: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),
  },

  issues: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/issues${q ? `?${q}` : ''}`);
    },
    create: (body) => request('/issues', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (issueId, body) =>
      request(`/issues/${issueId}/status`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (issueId) => request(`/issues/${issueId}`, { method: 'DELETE' }),
  },
};
