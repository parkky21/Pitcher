import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
    defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

export const STARTUPS_BY_ID_QUERY =
    defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  pitch,
}`)

export const STARTUP_VIEWS_QUERY =
    defineQuery(`*[_type == "startup" && _id == $id][0]{
    _id,
  views,
}`)

export const AUTHOR_BY_GOOGLE_ID_QUERY =
    defineQuery(`*[_type == "author" && id== $id][0]  {
    _id,
    id,
    name,
    username, 
    image,
    bio
  
}`)

export const AUTHOR_BY_SESSION_ID=
    defineQuery(`*[_type == "author" && _id== $id][0] {
    _id,
    name,
    username, 
    image,
    bio
}`)

export const STARTUPS_BY_AUTHOR_ID =
    defineQuery(`*[_type == "startup" && author._ref==$id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);