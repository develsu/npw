import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    DateField,
    EditButton,
    Show,
    SimpleShowLayout,
    RichTextField,
    BooleanField,
    BooleanInput,
} from 'react-admin';
import DescriptionIcon from '@mui/icons-material/Description';

const slugify = (value = '') =>
    value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9а-яё-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

const pageFilters = [
    <TextInput label="Поиск" source="q" alwaysOn />,
    <BooleanInput label="Опубликовано" source="published" />,
];
export const ContentPageList = (props) => (
    <List {...props} title="Страницы" filters={pageFilters}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="title" label="Заголовок" />
            <TextField source="slug" label="Слаг" />
            <BooleanField source="published" label="Опубликовано" />
            <DateField source="updated_at" label="Обновлено" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ContentPageEdit = (props) => (
    <Edit
        {...props}
        title="Редактировать страницу"
        transform={(data) => ({
            ...data,
            slug: slugify(data.slug),
        })}
    >
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="title" label="Заголовок" fullWidth />
            <TextInput source="slug" label="Слаг" fullWidth />
            <TextInput source="meta_title" label="Мета заголовок" fullWidth />
            <TextInput
                source="meta_description"
                label="Мета описание"
                multiline
                fullWidth
            />
            <TextInput source="content" label="Содержимое" multiline fullWidth />
            <BooleanInput source="published" label="Опубликовано" />
        </SimpleForm>
    </Edit>
);

export const ContentPageCreate = (props) => (
    <Create
        {...props}
        title="Создать страницу"
        transform={(data) => ({
            ...data,
            slug: slugify(data.slug || data.title),
        })}
    >
        <SimpleForm>
            <TextInput source="title" label="Заголовок" fullWidth />
            <TextInput source="slug" label="Слаг" fullWidth />
            <TextInput source="meta_title" label="Мета заголовок" fullWidth />
            <TextInput
                source="meta_description"
                label="Мета описание"
                multiline
                fullWidth
            />
            <TextInput source="content" label="Содержимое" multiline fullWidth />
            <BooleanInput source="published" label="Опубликовано" />
        </SimpleForm>
    </Create>
);

export const ContentPageShow = (props) => (
    <Show {...props} title="Просмотр страницы">
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" label="Заголовок" />
            <TextField source="slug" label="Слаг" />
            <TextField source="meta_title" label="Мета заголовок" />
            <TextField source="meta_description" label="Мета описание" />
            <RichTextField source="content" label="Содержимое" />
            <BooleanField source="published" label="Опубликовано" />
            <DateField source="created_at" label="Создано" />
            <DateField source="updated_at" label="Обновлено" />
        </SimpleShowLayout>
    </Show>
);

export const ContentPageIcon = DescriptionIcon;
