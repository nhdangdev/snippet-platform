export type Locale = 'en' | 'vi';

export const translations = {
  en: {
    common: {
      appName: 'Snippet Platform',
      tagline: 'Share Your Code with the World',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language',
    },
    nav: {
      home: 'Home',
      snippets: 'Snippets',
      tags: 'Tags',
      profile: 'Profile',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
    },
    profile: {
      title: 'Profile',
      edit: 'Edit Profile',
      stats: {
        snippets: 'Snippets',
        views: 'Total Views',
        likes: 'Likes',
        joined: 'Joined',
      },
      tabs: {
        snippets: 'My Snippets',
        favorites: 'Favorites',
        settings: 'Settings',
      },
      form: {
        username: 'Username',
        usernamePlaceholder: 'johndoe',
        name: 'Display Name',
        namePlaceholder: 'John Doe',
        bio: 'Bio',
        bioPlaceholder: 'Tell us about yourself...',
        email: 'Email',
        save: 'Save Changes',
        cancel: 'Cancel',
      },
      messages: {
        updateSuccess: 'Profile updated successfully',
        updateError: 'Failed to update profile',
      },
      empty: {
        title: 'No snippets yet',
        description: 'Start sharing your code with the community',
      },
    },
    seo: {
      home: {
        title: 'Snippet Platform - Share Code with Time Complexity Analysis',
        description:
          'A modern platform for developers to share, discover, and analyze code snippets with automatic time complexity detection.',
      },
      profile: {
        title: "{username}'s Profile - Snippet Platform",
        description: "View {username}'s shared code snippets and contributions.",
      },
    },
  },
  vi: {
    common: {
      appName: 'Nền tảng Snippet',
      tagline: 'Chia sẻ Code của bạn với Thế giới',
      loading: 'Đang tải...',
      error: 'Đã xảy ra lỗi',
      success: 'Thành công!',
      cancel: 'Hủy',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      create: 'Tạo mới',
      back: 'Quay lại',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      language: 'Ngôn ngữ',
    },
    nav: {
      home: 'Trang chủ',
      snippets: 'Đoạn mã',
      tags: 'Thẻ',
      profile: 'Hồ sơ',
      dashboard: 'Bảng điều khiển',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      signOut: 'Đăng xuất',
    },
    profile: {
      title: 'Hồ sơ',
      edit: 'Chỉnh sửa hồ sơ',
      stats: {
        snippets: 'Đoạn mã',
        views: 'Lượt xem',
        likes: 'Thích',
        joined: 'Tham gia',
      },
      tabs: {
        snippets: 'Đoạn mã của tôi',
        favorites: 'Yêu thích',
        settings: 'Cài đặt',
      },
      form: {
        username: 'Tên người dùng',
        usernamePlaceholder: 'johndoe',
        name: 'Tên hiển thị',
        namePlaceholder: 'Nguyễn Văn A',
        bio: 'Tiểu sử',
        bioPlaceholder: 'Giới thiệu về bạn...',
        email: 'Email',
        save: 'Lưu thay đổi',
        cancel: 'Hủy',
      },
      messages: {
        updateSuccess: 'Cập nhật hồ sơ thành công',
        updateError: 'Cập nhật hồ sơ thất bại',
      },
      empty: {
        title: 'Chưa có đoạn mã nào',
        description: 'Bắt đầu chia sẻ code của bạn với cộng đồng',
      },
    },
    seo: {
      home: {
        title:
          'Nền tảng Snippet - Chia sẻ Code với Phân tích Độ phức tạp Thời gian',
        description:
          'Nền tảng hiện đại để lập trình viên chia sẻ, khám phá và phân tích đoạn mã với tự động phát hiện độ phức tạp thời gian.',
      },
      profile: {
        title: 'Hồ sơ của {username} - Nền tảng Snippet',
        description:
          'Xem các đoạn mã được chia sẻ và đóng góp của {username} cho cộng đồng lập trình viên.',
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
