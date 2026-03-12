import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  User,
  Calendar,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { apiClient, Order } from '../lib/api';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadOrderDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'zh' ? '加载订单详情失败' : 'Failed to load order details'));
      console.error('Load order detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [id, lang]);

  useEffect(() => {
    if (id) {
      loadOrderDetail();
    }
  }, [id, loadOrderDetail]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      await apiClient.updateOrderStatus(order.id, newStatus);
      await loadOrderDetail();
    } catch (err) {
      alert(err instanceof Error ? err.message : (lang === 'zh' ? '更新订单状态失败' : 'Failed to update order status'));
      console.error('Update order status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-6 w-6" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-6 w-6" />;
      case 'REJECTED':
        return <XCircle className="h-6 w-6" />;
      case 'PAID':
        return <DollarSign className="h-6 w-6" />;
      case 'SHIPPED':
        return <Truck className="h-6 w-6" />;
      case 'COMPLETED':
        return <CheckCircle className="h-6 w-6" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status: string) => {
    const map: Record<string, { en: string; zh: string }> = {
      PENDING: { en: 'Pending', zh: '待处理' },
      ACCEPTED: { en: 'Accepted', zh: '已接受' },
      REJECTED: { en: 'Rejected', zh: '已拒绝' },
      PAID: { en: 'Paid', zh: '已支付' },
      SHIPPED: { en: 'Shipped', zh: '已发货' },
      COMPLETED: { en: 'Completed', zh: '已完成' },
      CANCELLED: { en: 'Cancelled', zh: '已取消' }
    };
    return map[status]?.[lang] || status;
  };

  const isSeller = order && user && order.sellerId === user.id;
  const isBuyer = order && user && order.buyerId === user.id;

  const getAvailableActions = () => {
    if (!order || !user) return [];

    const actions = [];

    if (isSeller) {
      if (order.status === 'PENDING') {
        actions.push(
          { label: t('acceptOrder'), status: 'ACCEPTED', color: 'bg-green-600 hover:bg-green-700' },
          { label: t('rejectOrder'), status: 'REJECTED', color: 'bg-red-600 hover:bg-red-700' }
        );
      }
      if (order.status === 'PAID') {
        actions.push({ label: t('markAsShipped'), status: 'SHIPPED', color: 'bg-purple-600 hover:bg-purple-700' });
      }
      if (order.status === 'SHIPPED') {
        actions.push({
          label: t('completeOrder'),
          status: 'COMPLETED',
          color: 'bg-emerald-600 hover:bg-emerald-700'
        });
      }
    }

    if (isBuyer) {
      if (order.status === 'ACCEPTED') {
        actions.push({ label: t('markAsPaid'), status: 'PAID', color: 'bg-green-600 hover:bg-green-700' });
      }
      if (order.status === 'SHIPPED') {
        actions.push({
          label: t('confirmReceived'),
          status: 'COMPLETED',
          color: 'bg-emerald-600 hover:bg-emerald-700'
        });
      }
      if (['PENDING', 'ACCEPTED'].includes(order.status)) {
        actions.push({ label: t('cancelOrder'), status: 'CANCELLED', color: 'bg-gray-600 hover:bg-gray-700' });
      }
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{lang === 'zh' ? '正在加载订单详情...' : 'Loading order details...'}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-800 font-medium mb-4">{error || (lang === 'zh' ? '订单不存在' : 'Order not found')}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {lang === 'zh' ? '返回订单列表' : 'Back to Orders'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{t('back')}</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
              <Package className="h-8 w-8" />
              {t('orderDetails')}
            </h1>
            <span className={`px-4 py-2 rounded-full text-base font-semibold border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {formatStatus(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-emerald-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{lang === 'zh' ? '商品信息' : 'Product Information'}</h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product Images */}
                <div className="w-full sm:w-32 md:w-48 h-40 sm:h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {order.item?.images?.[0] ? (
                    <img
                      src={order.item.images[0]}
                      alt={order.item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{order.item?.title || (lang === 'zh' ? '商品' : 'Product')}</h3>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-600">${order.item?.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/product/${order.itemId}`)}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    {lang === 'zh' ? '查看商品页面' : 'View Product Page'}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{lang === 'zh' ? '订单时间线' : 'Order Timeline'}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{lang === 'zh' ? '订单已创建' : 'Order Created'}</p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    order.status !== 'PENDING' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{lang === 'zh' ? '当前状态' : 'Current Status'}: {formatStatus(order.status)}</p>
                    <p className="text-sm text-gray-600">{lang === 'zh' ? '最近更新' : 'Last updated'}: {formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {getAvailableActions().length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{lang === 'zh' ? '可执行操作' : 'Available Actions'}</h2>
                <div className="flex flex-wrap gap-3">
                  {getAvailableActions().map((action) => (
                    <button
                      key={action.status}
                      onClick={() => updateOrderStatus(action.status)}
                      disabled={updating}
                      className={`px-6 py-2 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
                    >
                      {updating ? (lang === 'zh' ? '更新中...' : 'Updating...') : action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{lang === 'zh' ? '订单摘要' : 'Order Summary'}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{lang === 'zh' ? '订单号' : 'Order ID'}:</span>
                  <span className="font-mono text-xs text-gray-900">{order.id.slice(0, 12)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{t('total')}:</span>
                  <span className="font-bold text-lg text-emerald-600">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{t('orderDate')}:</span>
                  <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            {isSeller && order.buyer && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('buyer')} {t('accountInfo')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{order.buyer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {order.buyer.email}
                  </div>
                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t('contactBuyer')}
                  </button>
                </div>
              </div>
            )}

            {/* Seller Info */}
            {isBuyer && order.seller && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('seller')} {t('accountInfo')}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{order.seller.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {order.seller.email}
                  </div>
                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t('contactSeller')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
