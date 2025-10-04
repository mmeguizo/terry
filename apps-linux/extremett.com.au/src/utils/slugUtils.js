export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
};

export const validateSlug = (slug) => {
    return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
};