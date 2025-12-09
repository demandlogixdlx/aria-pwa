/**
 * ARIA PWA - Main Application
 * Handles UI interactions and message rendering
 */

const App = {
  // DOM elements (cached on init)
  elements: {
    conversation: null,
    messageInput: null,
    toast: null,
    toastText: null
  },

  /**
   * Initialize the app
   */
  init() {
    // Cache DOM elements
    this.elements.conversation = document.getElementById('conversation');
    this.elements.messageInput = document.getElementById('messageInput');
    this.elements.toast = document.getElementById('toast');
    this.elements.toastText = document.getElementById('toast-text');

    // Register service worker
    this.registerServiceWorker();

    // Scroll to bottom on load
    this.scrollToBottom();

    console.log('[App] ARIA PWA initialized');
  },

  /**
   * Register the service worker for PWA functionality
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[App] Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error);
      }
    }
  },

  /**
   * Toggle task completion status
   * @param {HTMLElement} element - The task item element
   */
  async toggleTask(element) {
    const taskId = element.dataset.taskId;
    const wasCompleted = element.classList.contains('completed');
    const isNowCompleted = !wasCompleted;

    // Optimistic UI update
    element.classList.toggle('completed');
    
    // Update badge count
    const card = element.closest('.card');
    if (card) {
      const completed = card.querySelectorAll('.task-item.completed').length;
      const total = card.querySelectorAll('.task-item').length;
      const badge = card.querySelector('.card-badge');
      if (badge) {
        badge.textContent = `${completed} of ${total}`;
      }
    }
    
    // Show toast
    const taskName = element.querySelector('.task-title').textContent;
    this.showToast(isNowCompleted ? `Marked ${taskName} done` : `Unmarked ${taskName}`);

    // Send to API (Phase 3 will make this real)
    if (taskId) {
      const result = await API.completeTask(parseInt(taskId), isNowCompleted);
      if (!result.success) {
        // Revert on failure
        element.classList.toggle('completed');
        this.showToast('Failed to update — try again');
      }
    }
  },

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   */
  showToast(message) {
    this.elements.toastText.textContent = message;
    this.elements.toast.classList.add('visible');
    
    setTimeout(() => {
      this.elements.toast.classList.remove('visible');
    }, 2000);
  },

  /**
   * Send a message from the input field
   */
  async sendMessage() {
    const input = this.elements.messageInput;
    const text = input.value.trim();
    
    if (!text) return;
    
    // Add user message to conversation
    this.addMessage(text, 'user');
    
    // Clear input
    input.value = '';
    this.autoResize(input);
    
    // Show typing indicator
    setTimeout(() => {
      this.showTyping();
      
      // Get response from API
      API.sendMessage(text).then((response) => {
        this.hideTyping();
        this.addMessage(response.message, 'aria');
        
        // Handle any cards in the response (Phase 3)
        if (response.cards && response.cards.length > 0) {
          // TODO: Render embedded cards
        }
      });
    }, 300);
  },

  /**
   * Send a quick reply from chips
   * @param {string} text - The quick reply text
   */
  sendQuickReply(text) {
    this.elements.messageInput.value = text;
    this.sendMessage();
  },

  /**
   * Add a message to the conversation
   * @param {string} text - The message text
   * @param {string} sender - 'user' or 'aria'
   */
  addMessage(text, sender) {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const message = document.createElement('div');
    message.className = `message ${sender}`;
    message.innerHTML = `
      <div class="message-bubble">
        <div class="message-text">${this.escapeHtml(text)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    this.elements.conversation.appendChild(message);
    this.scrollToBottom();
  },

  /**
   * Show typing indicator
   */
  showTyping() {
    const typing = document.createElement('div');
    typing.className = 'message aria';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="message-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    this.elements.conversation.appendChild(typing);
    this.scrollToBottom();
  },

  /**
   * Hide typing indicator
   */
  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  },

  /**
   * Auto-resize textarea based on content
   * @param {HTMLTextAreaElement} textarea 
   */
  autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  },

  /**
   * Handle keydown in message input
   * @param {KeyboardEvent} event 
   */
  handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  },

  /**
   * Scroll conversation to bottom
   */
  scrollToBottom() {
    this.elements.conversation.scrollTop = this.elements.conversation.scrollHeight;
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text 
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Global functions for HTML onclick handlers
function toggleTask(element) {
  App.toggleTask(element);
}

function sendMessage() {
  App.sendMessage();
}

function sendQuickReply(text) {
  App.sendQuickReply(text);
}

function handleKeyDown(event) {
  App.handleKeyDown(event);
}

function autoResize(textarea) {
  App.autoResize(textarea);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Also handle window.onload for backwards compatibility
window.onload = function() {
  App.scrollToBottom();
};
