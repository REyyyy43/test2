// Configure Amplify
const awsConfig = {
    Auth: {
        region: 'us-east-1', // Replace with your region
        userPoolId: 'us-east-1_example', // Replace with your User Pool ID
        userPoolWebClientId: 'example12345', // Replace with your App Client ID
    },
    API: {
        endpoints: [
            {
                name: "multiTenantAPI",
                endpoint: "https://example.appsync-api.us-east-1.amazonaws.com/graphql", // Replace with your GraphQL API endpoint
                region: "us-east-1",
            },
        ],
    },
};

aws_amplify.Amplify.configure(awsConfig);

// HTML Elements
const authSection = document.getElementById('auth-section');
const adminSection = document.getElementById('admin-section');
const userSection = document.getElementById('user-section');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const createUserButton = document.getElementById('create-user-button');
const newUsernameInput = document.getElementById('new-username');
const newEmailInput = document.getElementById('new-email');
const newRoleInput = document.getElementById('new-role');
const adminMessageInput = document.getElementById('admin-message');
const sendMessageButton = document.getElementById('send-message-button');
const adminMessageList = document.getElementById('admin-message-list');
const userMessageList = document.getElementById('user-message-list');

// Authentication
loginButton.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const user = await aws_amplify.Auth.signIn(username, password);
        console.log('User signed in:', user);
        loadDashboard(user);
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Login failed');
    }
});

logoutButton.addEventListener('click', async () => {
    try {
        await aws_amplify.Auth.signOut();
        console.log('User signed out');
        authSection.classList.remove('hidden');
        adminSection.classList.add('hidden');
        userSection.classList.add('hidden');
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

async function loadDashboard(user) {
    authSection.classList.add('hidden');
    logoutButton.classList.remove('hidden');

    const { attributes } = user;
    const role = attributes['custom:role'];

    if (role === 'Admin') {
        adminSection.classList.remove('hidden');
        loadMessages(adminMessageList, attributes['custom:tenantId']);
    } else {
        userSection.classList.remove('hidden');
        loadMessages(userMessageList, attributes['custom:tenantId']);
    }
}

// Create User
createUserButton.addEventListener('click', async () => {
    const username = newUsernameInput.value;
    const email = newEmailInput.value;
    const role = newRoleInput.value;

    try {
        const response = await aws_amplify.API.graphql({
            query: createUserMutation,
            variables: { username, email, tenantId, role },
        });
        console.log('User created:', response);
        alert('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user');
    }
});

// Load Messages
async function loadMessages(listElement, tenantId) {
    try {
        const query = `query ListMessages {
            listMessages(filter: { tenantId: { eq: "${tenantId}" } }) {
                items {
                    content
                    createdAt
                }
            }
        }`;
        const result = await aws_amplify.API.graphql({ query });
        const messages = result.data.listMessages.items;

        listElement.innerHTML = '';
        messages.forEach((msg) => {
            const li = document.createElement('li');
            li.textContent = `${msg.content} - ${new Date(msg.createdAt).toLocaleString()}`;
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Send Message
sendMessageButton.addEventListener('click', async () => {
    const content = adminMessageInput.value;
    const tenantId = await getTenantId();

    try {
        const mutation = `mutation CreateMessage {
            createMessage(input: { content: "${content}", tenantId: "${tenantId}" }) {
                id
                content
                createdAt
            }
        }`;
        const result = await aws_amplify.API.graphql({ query: mutation });
        console.log('Message created:', result);
        loadMessages(adminMessageList, tenantId);
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

async function getTenantId() {
    const user = await aws_amplify.Auth.currentAuthenticatedUser();
    return user.attributes['custom:tenantId'];
}