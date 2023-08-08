export interface NameDisplay {
    name: string;
}

export interface Movie {
    title: string;
    subtitle: string;
    text: string;
    images: Image[];
}

interface Image {
    url: string;
}