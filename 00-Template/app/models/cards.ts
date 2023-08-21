export interface NameDisplayCard {
    name: string;
}

export interface UserListItem {
    title: string;
    subtitle: string;
    text: string;
    images: Image[];
}

interface Image {
    url: string;
}