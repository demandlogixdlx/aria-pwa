/**
 * ARIA PWA - API Module
 * Handles all communication with n8n webhooks
 * 
 * Phase 3 will fill in the actual webhook URLs and logic
 */

const API = {
  // Webhook URLs - to be filled in Phase 3
  endpoints: {
    message: null,        // ARIA_Incoming_Message webhook
    taskComplete: null,   // ARIA_Task_Completion webhook
    pushSubscribe: null   // Push subscription storage webhook
  },

  // User identifier
  userId: 'priya',

  /**
   * Send a message to ARIA
   * @param {string} message - The user's message
   * @returns {Promise<object>} - ARIA's response with message and optional cards
   */
  async sendMessage(message) {
    // Phase 3: Replace with actual webhook call
    // For now, return a simulated response
    
    if (!this.endpoints.message) {
      console.log('[API] Message endpoint not configured, using simulation');
      return this._simulateResponse(message);
    }

    try {
      const response = await fetch(this.endpoints.message, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          user_id: this.userId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API] sendMessage error:', error);
      return {
        message: "I couldn't connect right now. Try again in a moment?",
        cards: []
      };
    }
  },

  /**
   * Mark a task as complete/incomplete
   * @param {number} taskId - The task ID
   * @param {boolean} completed - Whether the task is now completed
   * @returns {Promise<object>} - Confirmation response
   */
  async completeTask(taskId, completed) {
    // Phase 3: Replace with actual webhook call
    
    if (!this.endpoints.taskComplete) {
      console.log('[API] Task completion endpoint not configured, using simulation');
      return {
        success: true,
        task_id: taskId,
        status: completed ? 'completed' : 'pending'
      };
    }

    try {
      const response = await fetch(this.endpoints.taskComplete, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: taskId,
          completed: completed,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API] completeTask error:', error);
      return {
        success: false,
        error: 'Failed to update task'
      };
    }
  },

  /**
   * Register push notification subscription
   * @param {PushSubscription} subscription - The push subscription object
   * @returns {Promise<boolean>} - Whether registration succeeded
   */
  async registerPushSubscription(subscription) {
    // Phase 6: Implement push subscription storage
    
    if (!this.endpoints.pushSubscribe) {
      console.log('[API] Push subscription endpoint not configured');
      return false;
    }

    try {
      const response = await fetch(this.endpoints.pushSubscribe, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: this.userId,
          subscription: subscription.toJSON()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('[API] registerPushSubscription error:', error);
      return false;
    }
  },

  /**
   * Simulate ARIA response (used before Phase 3 webhook connection)
   * @private
   */
  _simulateResponse(message) {
    // Simple simulation for testing UI
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('done') || lowerMsg.includes('finished')) {
      return {
        message: "✓ Got it — nice work. What's next?",
        cards: []
      };
    }
    
    if (lowerMsg.includes('routine') || lowerMsg.includes('tasks')) {
      return {
        message: "Here's your current routine. Tap to mark items done.",
        cards: [] // Cards would be populated by actual API
      };
    }
    
    if (lowerMsg.includes('skip')) {
      return {
        message: "✓ Skipped for today. It'll be back tomorrow.",
        cards: []
      };
    }

    return {
      message: "✓ Got it — I'll note that.",
      cards: []
    };
  }
};

// Export for use in app.js
window.API = API;
