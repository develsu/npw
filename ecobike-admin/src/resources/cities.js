import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    Show,
    SimpleShowLayout,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Create,
    Filter
} from 'react-admin';

const CityFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Поиск" source="q" alwaysOn />
    </Filter>
);

export const CityList = (props) => (
    <List {...props} filters={<CityFilter />}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="name_ru" label="Название (RU)" />
            <TextField source="timezone" label="Часовой пояс" />
            <NumberField source="coordinates.lat" label="Широта" />
            <NumberField source="coordinates.lng" label="Долгота" />
            <DateField source="created_at" label="Создан" />
        </Datagrid>
    </List>
);

export const CityShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name_ru" label="Название (RU)" />
            <TextField source="name_kz" label="Название (KZ)" />
            <TextField source="name_en" label="Название (EN)" />
            <TextField source="timezone" label="Часовой пояс" />
            <NumberField source="coordinates.lat" label="Широта" />
            <NumberField source="coordinates.lng" label="Долгота" />
            <DateField source="created_at" label="Создан" />
            <DateField source="updated_at" label="Обновлен" />
        </SimpleShowLayout>
    </Show>
);

export const CityEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name_ru" label="Название (RU)" required />
            <TextInput source="name_kz" label="Название (KZ)" />
            <TextInput source="name_en" label="Название (EN)" />
            <TextInput source="timezone" label="Часовой пояс" />
            <NumberInput source="coordinates.lat" label="Широта" required />
            <NumberInput source="coordinates.lng" label="Долгота" required />
        </SimpleForm>
    </Edit>
);

export const CityCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name_ru" label="Название (RU)" required />
            <TextInput source="name_kz" label="Название (KZ)" />
            <TextInput source="name_en" label="Название (EN)" />
            <TextInput source="timezone" label="Часовой пояс" defaultValue="Asia/Almaty" />
            <NumberInput source="coordinates.lat" label="Широта" required />
            <NumberInput source="coordinates.lng" label="Долгота" required />
        </SimpleForm>
    </Create>
);

