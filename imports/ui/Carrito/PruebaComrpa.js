
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { VentasCollection } from '/imports/collection/collections';
import { useTracker } from "meteor/react-meteor-data";
import { Chip } from '@mui/material';

export default function RowExpansionDemo() {
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const products = useTracker(() => {
        // Meteor.subscribe("users");
        let a = [];
    
        Meteor.subscribe("ventas", { idUser: Meteor.userId() }) &&
          VentasCollection.find({ idUser: Meteor.userId() }).map(
            (data) =>
              data &&
              a.push({
                id: data._id,
                idUser: data.idUser,
                createdAt: data.createdAt,
                status: data.status,
                comprasEnCarrito: data.comprasEnCarrito,
                count: data.comprasEnCarrito && data.comprasEnCarrito.length,
                idPaypal: data.idPaypal,
              })
          );
              console.log(a);
        return a;
      });

    // useEffect(() => {
    //     ProductService.getProductsWithOrdersSmall().then((data) => setProducts(data));
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };

    const expandAll = () => {
        let _expandedRows = {};

        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.producto.precio);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getOrderSeverity(rowData)}></Tag>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} width="64px" className="shadow-4" />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };
    const idPaypalBodyTemplate = (rowData) => {
        return <Chip>{rowData.idPaypal}</Chip>;
    };
    const idProductoBodyTemplate = (rowData) => {
        return <Chip>{rowData.idProducto}</Chip>;
    };
    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
    };

    const getProductSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const getOrderSeverity = (order) => {
        switch (order.status) {
            case 'ENTREGADO':
                return 'success';

            case 'CANCELLED':
                return 'danger';

            case 'ENCAMINO':
                return 'warning';

            case 'PREPARANDO':
                return 'info';

            default:
                return null;
        }
    };

    const allowExpansion = (rowData) => {
        return rowData.comprasEnCarrito.length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Orders for {data.id}</h5>
                <DataTable value={data.comprasEnCarrito}>
                    {/* <Column field="producto.name" header="Id" sortable></Column> */}
                    {/* <Column field="customer" header="Customer" sortable></Column> */}
                    {/* <Column field="createdAt" header="createdAt" sortable></Column> */}
                    <Column field="producto.precio" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="idProducto" header="ID Producto" body={idProductoBodyTemplate} sortable></Column>
                    {/* <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column> */}
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable value={products} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                {/* <Column field="name" header="Name" sortable /> */}
                {/* <Column header="Image" body={imageBodyTemplate} /> */}
                {/* <Column field="idPaypal" header="ID Paypal" sortable body={priceBodyTemplate} /> */}
                <Column field="idPaypal" header="ID Paypal" sortable body={idPaypalBodyTemplate} />
                {/* <Column field="category" header="Category" sortable /> */}
                {/* <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} /> */}
                {/* <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate} /> */}
            </DataTable>
        </div>
    );
}