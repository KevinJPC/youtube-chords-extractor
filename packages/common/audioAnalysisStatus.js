// Default job states of bullmq
export const JOB_STATE = {
  waiting: 'waiting',
  failed: 'failed',
  completed: 'completed',
  active: 'active',
  delayed: 'delayed',
  'waiting-children': 'waiting-children',
  unknown: 'unknown'
}
// Simplified job state return to the client
export const JOB_STATUS = {
  waiting: 'waiting',
  failed: 'failed',
  completed: 'completed',
  processing: 'processing'
}

export const JOB_STATUS_BY_STATE = {
  [JOB_STATE.waiting]: JOB_STATUS.waiting,
  [JOB_STATE.delayed]: JOB_STATUS.waiting,
  [JOB_STATE['waiting-children']]: JOB_STATUS.waiting,
  [JOB_STATE.completed]: JOB_STATUS.completed,
  [JOB_STATE.failed]: JOB_STATUS.failed,
  [JOB_STATE.active]: JOB_STATUS.processing
}
