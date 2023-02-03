const drawerItems = [
  {
    title: 'Dictionary',
    href: '/dictionary',
    root: true,
  },
  {
    title: 'Posts',
    root: true,
    items: [
      {
        title: 'List',
        href: '/posts',
      },
      {
        title: 'Write',
        href: '/posts/write',
      },
    ],
  },
  {
    title: 'Gallery',
    root: true,
    items: [
      {
        title: 'List',
        href: '/gallery',
      },
      {
        title: 'Write',
        href: '/gallery/write',
      },
    ],
  },
  {
    title: 'User',
    root: true,
    items: [
      {
        title: 'List',
        href: '/user',
      },
      {
        title: 'Admin Profile',
        href: '/user/admin',
      },
    ],
  },
];

export default drawerItems;
