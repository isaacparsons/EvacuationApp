export const USER1 = {
  email: "test@email.com",
  phoneNumber: "4031234567",
  accountCreated: true,
  password: "123"
};

export const USER2 = {
  email: "test2@email.com",
  phoneNumber: "4031234568",
  accountCreated: true,
  password: "123"
};

export const ORG = {
  name: "test org"
};

export const ORG_ADMIN_MEMBER = {
  status: "accepted",
  admin: true
};

export const ORG_NON_ADMIN_MEMBER = {
  status: "accepted",
  admin: false
};

export const ANNOUNCEMENT = (userId: number) => {
  return {
    title: "test announcement",
    description: "test description",
    date: new Date(1, 1, 1).toISOString(),
    createdBy: userId
  };
};

export const GROUP = {
  name: "test group"
};

export const GROUP_NOTIFICATION_SETTING = {
  emailEnabled: false,
  smsEnabled: false,
  pushEnabled: false
};

export const GROUP_ADMIN_MEMBER = {
  status: "accepted",
  admin: true
};

export const GROUP_NON_ADMIN_MEMBER = {
  status: "accepted",
  admin: false
};
