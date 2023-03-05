const drawerItems = [
  {
    title: 'Dictionary',
    href: '/dictionary',
    root: true,
  },
  {
    title: 'Gallery',
    root: true,
    href: '/gallery',
  },
  {
    title: 'Writer',
    root: true,
    href: '/writer',
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
];

export default drawerItems;
